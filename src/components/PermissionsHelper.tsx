import { useMemo, useState } from 'react';

type PermissionState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'enabled' }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'error'; message: string };

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
};

const permissionLabel = (state: PermissionState): string => {
  switch (state.status) {
    case 'idle':
      return 'Not enabled';
    case 'requesting':
      return 'Requesting…';
    case 'enabled':
      return 'Enabled';
    case 'denied':
      return 'Denied';
    case 'unsupported':
      return 'Unsupported';
    case 'error':
      return 'Error';
  }
};

const permissionToneClass = (state: PermissionState): string => {
  switch (state.status) {
    case 'enabled':
      return 'border-emerald-300 bg-emerald-50 text-emerald-800';
    case 'denied':
      return 'border-rose-300 bg-rose-50 text-rose-800';
    case 'unsupported':
      return 'border-tru-grey bg-tru-cloud text-tru-grey';
    case 'requesting':
      return 'border-tru-yellow bg-tru-cloud text-tru-blue';
    case 'error':
      return 'border-amber-300 bg-amber-50 text-amber-900';
    case 'idle':
    default:
      return 'border-tru-grey bg-white text-tru-blue';
  }
};

const isNotAllowedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const name = 'name' in error ? String((error as { name?: unknown }).name) : '';
  return name === 'NotAllowedError' || name === 'PermissionDeniedError';
};

const PermissionsHelper = () => {
  const [camera, setCamera] = useState<PermissionState>({ status: 'idle' });
  const [gps, setGps] = useState<PermissionState>({ status: 'idle' });
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const canRequest = useMemo(() => {
    return camera.status !== 'requesting' && gps.status !== 'requesting';
  }, [camera.status, gps.status]);

  const requestCamera = async () => {
    if (typeof navigator === 'undefined') {
      setCamera({ status: 'unsupported' });
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera({ status: 'unsupported' });
      return;
    }

    setCamera({ status: 'requesting' });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCamera({ status: 'enabled' });
    } catch (error) {
      if (isNotAllowedError(error)) {
        setCamera({ status: 'denied' });
      } else {
        setCamera({ status: 'error', message: toErrorMessage(error) });
      }
    }
  };

  const requestGps = async () => {
    if (typeof navigator === 'undefined') {
      setGps({ status: 'unsupported' });
      return;
    }
    if (!navigator.geolocation?.getCurrentPosition) {
      setGps({ status: 'unsupported' });
      return;
    }

    setGps({ status: 'requesting' });
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGps({ status: 'enabled' });
          resolve();
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setGps({ status: 'denied' });
          } else {
            setGps({ status: 'error', message: error.message || 'Unable to access location.' });
          }
          resolve();
        },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 8000 }
      );
    });
  };

  const handleEnable = async () => {
    if (!canRequest) {
      return;
    }
    await Promise.all([requestCamera(), requestGps()]);
    setLastUpdatedAt(new Date().toISOString());
  };

  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-tru-blue">How to use this tool</h2>
          <p className="mt-1 text-xs text-tru-grey">
            Enter the building details, then work through floors and features. Add notes and photos
            as evidence. Your data stays on this device until export.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleEnable}
            disabled={!canRequest}
            className="rounded-lg bg-tru-blue px-4 py-2 text-sm font-semibold text-tru-cloud focus-visible:ring-2 focus-visible:ring-tru-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            Enable Camera + GPS
          </button>

          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold ${permissionToneClass(
                camera
              )}`}
            >
              Camera: {permissionLabel(camera)}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold ${permissionToneClass(
                gps
              )}`}
            >
              GPS: {permissionLabel(gps)}
            </span>
          </div>
        </div>

        {camera.status === 'error' ? (
          <p className="text-xs font-semibold text-amber-900">Camera error: {camera.message}</p>
        ) : null}
        {gps.status === 'error' ? (
          <p className="text-xs font-semibold text-amber-900">GPS error: {gps.message}</p>
        ) : null}
        {lastUpdatedAt ? (
          <p className="text-[11px] text-tru-grey">Last checked: {new Date(lastUpdatedAt).toLocaleString()}</p>
        ) : null}
      </div>
    </section>
  );
};

export default PermissionsHelper;

