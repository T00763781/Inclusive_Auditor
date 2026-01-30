import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode
} from 'react';
import { createPortal } from 'react-dom';

type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
};

type Position = { top: number; left: number; placement: TooltipPlacement };

const OFFSET = 8;
const VIEWPORT_PADDING = 8;

const uniquePlacements = (preferred: TooltipPlacement) => {
  const order: TooltipPlacement[] = ['top', 'right', 'bottom', 'left'];
  return [preferred, ...order.filter((item) => item !== preferred)];
};

const Tooltip = ({ content, children, placement = 'top' }: TooltipProps) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement });

  const updatePosition = () => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const compute = (nextPlacement: TooltipPlacement) => {
      switch (nextPlacement) {
        case 'bottom':
          return {
            top: triggerRect.bottom + OFFSET,
            left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          };
        case 'left':
          return {
            top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.left - tooltipRect.width - OFFSET
          };
        case 'right':
          return {
            top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.right + OFFSET
          };
        case 'top':
        default:
          return {
            top: triggerRect.top - tooltipRect.height - OFFSET,
            left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          };
      }
    };

    const fits = (pos: { top: number; left: number }) =>
      pos.left >= VIEWPORT_PADDING &&
      pos.top >= VIEWPORT_PADDING &&
      pos.left + tooltipRect.width <= viewportWidth - VIEWPORT_PADDING &&
      pos.top + tooltipRect.height <= viewportHeight - VIEWPORT_PADDING;

    let nextPlacement = placement;
    let coords = compute(placement);

    for (const candidate of uniquePlacements(placement)) {
      const candidateCoords = compute(candidate);
      if (fits(candidateCoords)) {
        nextPlacement = candidate;
        coords = candidateCoords;
        break;
      }
    }

    const clampedLeft = Math.min(
      Math.max(VIEWPORT_PADDING, coords.left),
      viewportWidth - tooltipRect.width - VIEWPORT_PADDING
    );
    const clampedTop = Math.min(
      Math.max(VIEWPORT_PADDING, coords.top),
      viewportHeight - tooltipRect.height - VIEWPORT_PADDING
    );

    setPosition({ top: clampedTop, left: clampedLeft, placement: nextPlacement });
  };

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, content, placement]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let animationFrame = 0;
    const handleScroll = () => {
      animationFrame = window.requestAnimationFrame(updatePosition);
    };
    const handleResize = () => {
      updatePosition();
    };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [open, placement, content]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || tooltipRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleBlur = () => {
    setOpen(false);
  };

  const handleMouseLeave = (event: ReactMouseEvent) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && (triggerRef.current?.contains(nextTarget) || tooltipRef.current?.contains(nextTarget))) {
      return;
    }
    setOpen(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    const isButton = event.currentTarget instanceof HTMLButtonElement;
    if ((event.key === 'Enter' || event.key === ' ') && !isButton) {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  const trigger = cloneElement(children, {
    'aria-expanded': open,
    'aria-controls': tooltipId,
    'aria-describedby': tooltipId,
    onClick: (event: ReactMouseEvent) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented) {
        handleClick();
      }
    },
    onBlur: (event: ReactFocusEvent) => {
      children.props.onBlur?.(event);
      if (!event.defaultPrevented) {
        handleBlur();
      }
    },
    onKeyDown: (event: ReactKeyboardEvent) => {
      children.props.onKeyDown?.(event);
      if (!event.defaultPrevented) {
        handleKeyDown(event);
      }
    }
  });

  const canUseDOM = typeof document !== 'undefined';

  return (
    <span ref={triggerRef} className="inline-flex" onMouseLeave={handleMouseLeave}>
      {trigger}
      {open && canUseDOM
        ? createPortal(
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              data-placement={position.placement}
              className="fixed z-[9999] max-w-[18rem] whitespace-normal break-words rounded-lg border border-tru-sage bg-tru-cloud p-3 text-xs text-tru-blue shadow-soft leading-relaxed"
              style={{ top: `${position.top}px`, left: `${position.left}px` }}
              onMouseLeave={handleMouseLeave}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </span>
  );
};

export default Tooltip;
