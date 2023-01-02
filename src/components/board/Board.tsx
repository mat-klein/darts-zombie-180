import {
  useEffect,
  useRef,
  useState,
  TouchEvent,
  Touch,
} from 'react';
import { useHover } from 'usehooks-ts';
import BoardSlice from './BoardSlice';
import BoardBull from './BoardBull';
import BoardCircleElement from './BoardCircleElement';
import {
  CoordinateSystem,
  Vector2,
  csCenter,
  toBaseCoordinates,
  translateCoordinateSystem,
  vectorDiff,
  vectorMultiply,
} from '../../utils/coordinates';
import { SlicePart, boardSliceNumbers } from '../../utils/darts';
import { zoomOnPoint } from '../../utils/zoom';
import { Color, newColor } from '../../utils/colors';

type BoardProps = {
  initialZoom: number;
  initialPosition: Vector2;
  overlayColors?: Record<number, Partial<Record<SlicePart, Color>>>;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const Board = ({
  initialZoom,
  initialPosition,
  overlayColors,
  onTrigger,
  onActivate,
  onDeactivate,
}: BoardProps) => {
  const ref20 = useRef(null);
  const isHover20 = useHover(ref20);
  const [currentActiveElement, setCurrentActiveElement] =
    useState<any>(null);

  // centerX, centerY, zoom
  const maxZoom = 7;
  const intervalMs = 20;
  const windowW2 = window.innerWidth / 2;
  const windowH2 = window.innerHeight / 2;
  const [screenView, setScreenView] = useState<CoordinateSystem>([
    ...initialPosition,
    initialZoom,
  ]);
  useEffect(() => {
    setScreenView([...initialPosition, initialZoom]);
  }, [initialPosition, initialZoom]);
  const [touchCenter, setTouchCenter] = useState<Vector2 | null>(
    null
  );
  const [centerVelocity, setCenterVelocity] = useState<Vector2>([
    0, 0,
  ]);
  const [cancelInterval, setCancelInterval] = useState<number | null>(
    null
  );
  const [touchIdentifier, setTouchIdentifier] = useState<
    number | null
  >(null);

  /**
   * animate resetting the zoom & center to initial values
   */
  function resetScreenView() {
    setCenterVelocity([0, 0]);
    let oldScreenView = [...screenView];
    setScreenView((screenView) => {
      oldScreenView = screenView;
      return screenView;
    });

    const interpolationStep = 0.08;
    let resetInterpolate = 1.0;
    const resetInterval = window.setInterval(() => {
      const interpolateZoom = Math.pow(resetInterpolate, 1);

      resetInterpolate -= interpolationStep;
      if (resetInterpolate <= 0) {
        resetInterpolate = 0;
        window.clearInterval(resetInterval);
      }

      setTouchCenter((touchCenter) => {
        if (!touchCenter) return touchCenter;

        setScreenView((screenView) => {
          if (resetInterpolate === 0) {
            return [...initialPosition, initialZoom];
          }

          const finalCSZoomOnly = zoomOnPoint(
            screenView,
            touchCenter,
            initialZoom
          );
          const offsetCS = vectorDiff(
            initialPosition,
            csCenter(finalCSZoomOnly)
          );
          const moveCSStep = vectorMultiply(
            offsetCS,
            interpolationStep / resetInterpolate
          );
          const newScale =
            oldScreenView[2] * interpolateZoom +
            initialZoom * (1 - interpolateZoom);
          const newScreenView = zoomOnPoint(
            screenView,
            touchCenter,
            newScale
          );

          return translateCoordinateSystem(newScreenView, moveCSStep);
        });

        return touchCenter;
      });
    }, intervalMs);
  }

  function updateCenterVelocity(ptClient: Vector2) {
    const windowMoveThreshold = 0.5;
    const velocityFactor = 0.3;
    const newCenterVelocity: [number, number] = [
      ptClient[0] > windowW2 * windowMoveThreshold
        ? velocityFactor *
          (ptClient[0] - windowW2 * windowMoveThreshold)
        : ptClient[0] < -windowW2 * windowMoveThreshold
        ? velocityFactor *
          (ptClient[0] + windowW2 * windowMoveThreshold)
        : 0,
      ptClient[1] > windowH2 * windowMoveThreshold
        ? velocityFactor *
          (ptClient[1] - windowH2 * windowMoveThreshold)
        : ptClient[1] < -windowH2 * windowMoveThreshold
        ? velocityFactor *
          (ptClient[1] + windowH2 * windowMoveThreshold)
        : 0,
    ];
    setCenterVelocity(newCenterVelocity);
  }

  function forwardTouchStartToElements(touch: Touch) {
    const elem = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    if (elem !== currentActiveElement) {
      if (currentActiveElement) {
        const event = new Event('board-element:deactivate');
        currentActiveElement?.dispatchEvent(event);
      } else {
        onActivate?.();
      }
      setCurrentActiveElement(elem);
      const event = new Event('board-element:activate');
      elem?.dispatchEvent(event);
    }
  }

  function forwardTouchMoveToElements(touch: Touch) {
    const elem = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    if (elem !== currentActiveElement) {
      if (currentActiveElement) {
        const event = new Event('board-element:deactivate');
        currentActiveElement?.dispatchEvent(event);
      }
      setCurrentActiveElement(elem);
      const event = new Event('board-element:activate', {
        // @ts-ignore
        detail: 'data',
      });
      elem?.dispatchEvent(event);
    }
  }

  function moveTouchPoint(touchScreenPt: Vector2) {
    setScreenView((screenView: CoordinateSystem) => {
      const ptBoard = toBaseCoordinates(touchScreenPt, screenView);
      if (screenView[2] < maxZoom * 0.95) {
        setTouchCenter(ptBoard);
      } else {
        updateCenterVelocity(touchScreenPt);
      }
      return screenView;
    });
  }

  function startTouchZoom(touchScreenPt: Vector2) {
    const ptBoard = toBaseCoordinates(touchScreenPt, screenView);
    setTouchCenter(ptBoard);
    setCancelInterval(
      window.setInterval(() => {
        setTouchCenter((touchCenter) => {
          if (!touchCenter) return null;
          setCenterVelocity((centerVelocity) => {
            setScreenView((screenView: CoordinateSystem) => {
              const newScale =
                screenView[2] *
                Math.pow(1.25, (maxZoom - screenView[2]) / maxZoom);

              return translateCoordinateSystem(
                zoomOnPoint(screenView, touchCenter, newScale),
                vectorMultiply(centerVelocity, intervalMs / 1000)
              );
            });
            return centerVelocity;
          });
          return touchCenter;
        });
      }, intervalMs)
    );
  }

  function cancelZoomInterval() {
    setCancelInterval((cancelInterval) => {
      if (cancelInterval) {
        window.clearInterval(cancelInterval);
      }
      return null;
    });
  }

  function abortZoomSelection() {
    cancelZoomInterval();
    setTouchIdentifier(null);
    deactivateCurrentElement();
    resetScreenView();
  }

  function triggerCurrentElement() {
    if (currentActiveElement) {
      const event = new Event('board-element:trigger');
      currentActiveElement?.dispatchEvent(event);
      setCurrentActiveElement(null);
    }
  }

  function deactivateCurrentElement() {
    if (currentActiveElement) {
      const event = new Event('board-element:deactivate');
      currentActiveElement?.dispatchEvent(event);
      setCurrentActiveElement(null);
    }
    onDeactivate?.();
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length > 1) {
      abortZoomSelection();
      return;
    }

    cancelZoomInterval();
    const touch = e.targetTouches[0];
    setTouchIdentifier(touch.identifier);
    forwardTouchStartToElements(touch);

    startTouchZoom([
      touch.clientX - windowW2,
      touch.clientY - windowH2,
    ]);
  }

  function onTouchMove(e: TouchEvent) {
    const touch = e.targetTouches[0];
    if (touchIdentifier !== touch.identifier) {
      return;
    }

    forwardTouchMoveToElements(touch);

    moveTouchPoint([
      touch.clientX - windowW2,
      touch.clientY - windowH2,
    ]);
  }

  function onTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0];
    if (touchIdentifier !== touch.identifier) {
      return;
    }
    cancelZoomInterval();
    resetScreenView();
    triggerCurrentElement();
  }

  function onTouchCancel(e: TouchEvent) {
    const touch = e.changedTouches[0];
    if (touchIdentifier !== touch.identifier) {
      return;
    }
    cancelZoomInterval();
    deactivateCurrentElement();
    resetScreenView();
  }

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-200 -200 400 400"
      style={{
        flex: 1,
      }}
    >
      <style>
        {`
        @font-face {
          font-family: 'Kumar One';
          font-style: normal;
          font-weight: 400;
          src: local('Kumar One'), 
               url('/darts-zombie-180/assets/KumarOne-Regular.ttf') format('woff');
        }
        
      .board-number {
        text-align: center;
        fill: white;
        font-family: 'Kumar One';
        font-size: 26px;
      }
        `}
      </style>
      <g
        style={{
          transform: `scale(${
            screenView[2]
          }) translate(${-screenView[0]}px, ${-screenView[1]}px)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        <BoardCircleElement
          radius={181.5}
          color={newColor(0, 0, 0, 1)}
        />
        <BoardCircleElement
          radius={181.5}
          color={newColor(0, 0, 0, 1)}
          overlayColor={overlayColors?.[0]?.none}
          onTrigger={() => onTrigger?.(0, 'none')}
        />
        {boardSliceNumbers.map((number, inx) => (
          <BoardSlice
            key={number}
            number={number}
            angle={18 * inx}
            darkSlice={inx % 2 === 0}
            overlayColors={overlayColors?.[number]}
            onTrigger={onTrigger}
          />
        ))}
        <BoardBull
          innerRadius={8}
          outerRadius={20}
          overlayColors={overlayColors?.[25]}
          onTrigger={onTrigger}
        />
      </g>
    </svg>
  );
};

export default Board;
