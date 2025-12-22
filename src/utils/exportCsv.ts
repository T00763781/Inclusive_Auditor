export const buildCsvFilename = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `tru-access-audit_${year}-${month}-${day}.csv`;
};

export const exportCsvFile = async (csv: string, filename: string): Promise<void> => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof File !== 'undefined';

  if (canShareFiles) {
    let file: File | null = null;
    try {
      file = new File([blob], filename, { type: 'text/csv;charset=utf-8' });
    } catch {
      file = null;
    }

    if (file) {
      let canShare = false;
      try {
        canShare = navigator.canShare({ files: [file] });
      } catch {
        canShare = false;
      }

      if (canShare) {
        try {
          await navigator.share({
            files: [file],
            title: 'TRU Accessibility Audit',
            text: 'Audit export'
          });
          return;
        } catch {
          // Fall back to download.
        }
      }
    }
  }

  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error('export-not-supported');
  }

  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('export-not-supported');
  }
};
