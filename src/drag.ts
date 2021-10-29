import {
  Observable,
  Subject,
  skipUntil,
  takeUntil,
  filter,
  repeat,
} from "rxjs";

interface DragConfig {
  initiatingWindowId: string;
  global: boolean;
}

// startDrag(dragConfig)
// ...drag events -> absolute, relative drag streams
// stopDrag()

type DragEvents =
  | {
      type: "start";
      payload: DragConfig;
    }
  | {
      type: "drag";
      payload: MouseEvent;
    }
  | {
      type: "stop";
    };

const drag$ = new Subject<DragEvents>();
export function startDrag(config: DragConfig) {
  drag$.next({
    type: "start",
    payload: config,
  });
}

export function continueDrag(event: MouseEvent) {
  drag$.next({
    type: "drag",
    payload: event,
  });
}

export function stopDrag() {
  drag$.next({
    type: "stop",
  });
}

export const dragMoves$ = between(
  drag$,
  (action) => action.type === "start",
  (action) => action.type === "drag",
  (action) => action.type === "stop"
);

function between<TStreamContent>(
  source$: Observable<TStreamContent>,
  start: (c: TStreamContent) => boolean,
  middle: (c: TStreamContent) => boolean,
  end: (c: TStreamContent) => boolean
) {
  return source$.pipe(
    skipUntil(source$.pipe(filter(start))),
    filter(middle),
    takeUntil(source$.pipe(filter(end))),
    repeat()
  );
}
