import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHover } from 'usehooks-ts';
import BoardSlice from './BoardSlice';
import BoardBull from './BoardBull';

type SlicePart = 'inner' | 'triple' | 'outer' | 'double';

type BoardProps = {
  initialZoom: number;
  initialPosition: [number, number];
  onActivate?: () => void;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const Board = ({
  initialZoom,
  initialPosition,
  onTrigger,
  onActivate,
}: BoardProps) => {
  const ref20 = useRef(null);
  const isHover20 = useHover(ref20);
  const [currentActiveElement, setCurrentActiveElement] =
    useState<any>(null);

  // centerX, centerY, zoom
  const maxZoom = 7;
  const [screenView, setScreenView] = useState([
    ...initialPosition,
    initialZoom,
  ]);
  useEffect(() => {
    if (
      initialPosition[0] !== screenView[0] ||
      initialPosition[1] !== screenView[1] ||
      initialZoom !== screenView[2]
    ) {
      // TODO: solve this shit
      //setScreenView([...initialPosition, initialZoom]);
    }
  }, [initialPosition, initialZoom]);
  const [touchCenter, setTouchCenter] = useState<any>(null);
  const [cancelInterval, setCancelInterval] = useState<any>(null);

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-200 -200 400 400"
      style={{
        flex: 1,
      }}
    >
      <g
        style={{
          transform: `scale(${
            screenView[2]
          }) translate(${-screenView[0]}px, ${-screenView[1]}px)`,
        }}
        onTouchStart={(e) => {
          const touch = e.targetTouches[0];
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
            const event = new Event('board-element:activate', {
              // @ts-ignore
              detail: 'data',
            });
            elem?.dispatchEvent(event);
          }
          console.log('window.innerWidth', window.innerWidth);
          console.log('window.innerHeight', window.innerHeight);
          const ptClient = [
            touch.clientX - window.innerWidth / 2,
            touch.clientY - window.innerHeight / 2,
          ];
          const ptBoard = [
            screenView[0] + ptClient[0] / screenView[2],
            screenView[1] + ptClient[1] / screenView[2],
          ];
          console.log('ptBoard', ptBoard);
          setTouchCenter(ptBoard);
          setCancelInterval(
            window.setInterval(() => {
              setTouchCenter((touchCenter: any) => {
                setScreenView((screenView: any) => {
                  const scale = screenView[2];
                  const newScale =
                    screenView[2] *
                    Math.pow(1.25, (maxZoom - scale) / maxZoom);
                  // const touchCenter = [125, 0];
                  const newCenter = [
                    touchCenter[0] * (1 - scale / newScale) +
                      (screenView[0] * scale) / newScale,
                    touchCenter[1] * (1 - scale / newScale) +
                      (screenView[1] * scale) / newScale,
                  ];
                  console.log('screenView', screenView);
                  console.log('touchCenter', touchCenter);
                  console.log('newCenter', newCenter);
                  return [...newCenter, newScale];
                });
                return touchCenter;
              });
            }, 20)
          );
        }}
        onTouchMove={(e) => {
          const touch = e.targetTouches[0];
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

          setScreenView((screenView: any) => {
            const ptClient = [
              touch.clientX - window.innerWidth / 2,
              touch.clientY - window.innerHeight / 2,
            ];
            const ptBoard = [
              screenView[0] + ptClient[0] / screenView[2],
              screenView[1] + ptClient[1] / screenView[2],
            ];
            setTouchCenter(ptBoard);
            return screenView;
          });
        }}
        onTouchEnd={(e) => {
          if (cancelInterval) {
            window.clearInterval(cancelInterval);
            setCancelInterval(null);
            let oldScreenView = [...screenView];
            setScreenView((screenView) => {
              oldScreenView = screenView;
              return screenView;
            });
            let resetInterpolate = 1.0;
            const resetInterval = window.setInterval(() => {
              resetInterpolate -= 0.05;
              setScreenView([
                oldScreenView[0] * resetInterpolate +
                  initialPosition[0] * (1 - resetInterpolate),
                oldScreenView[1] * resetInterpolate +
                  initialPosition[1] * (1 - resetInterpolate),
                oldScreenView[2] * resetInterpolate +
                  initialZoom * (1 - resetInterpolate),
              ]);
              if (resetInterpolate <= 0) {
                window.clearInterval(resetInterval);
              }
            }, 20);
          }
          if (currentActiveElement) {
            const event = new Event('board-element:trigger');
            currentActiveElement?.dispatchEvent(event);
            setCurrentActiveElement(null);
          }
        }}
      >
        <circle cx="0" cy="0" r="181.5" fill="black" />
        <BoardSlice
          number={20}
          angle={18 * 0}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={1}
          angle={18 * 1}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={18}
          angle={18 * 2}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={4}
          angle={18 * 3}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={13}
          angle={18 * 4}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={6}
          angle={18 * 5}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={10}
          angle={18 * 6}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={15}
          angle={18 * 7}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={2}
          angle={18 * 8}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={17}
          angle={18 * 9}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={3}
          angle={18 * 10}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={19}
          angle={18 * 11}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={7}
          angle={18 * 12}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={16}
          angle={18 * 13}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={8}
          angle={18 * 14}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={11}
          angle={18 * 15}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={14}
          angle={18 * 16}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={9}
          angle={18 * 17}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={12}
          angle={18 * 18}
          darkSlice={true}
          onTrigger={onTrigger}
        />
        <BoardSlice
          number={5}
          angle={18 * 19}
          darkSlice={false}
          onTrigger={onTrigger}
        />
        <BoardBull
          innerRadius={8}
          outerRadius={20}
          onTrigger={onTrigger}
        />
      </g>
    </svg>
  );
};

export default Board;
