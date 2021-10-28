import {
  Observable,
  Subject,
  Subscription,
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

(window as any).startDrag = startDrag;
(window as any).continueDrag = continueDrag;
(window as any).stopDrag = stopDrag;
(window as any).dragMoves = dragMoves$;

const aSubject$ = new Subject<any>();
aSubject$.subscribe((e) => console.log("Subject got something", e));

const firstProducer$ = new Subject<any>();
function sendOne(payload: any) {
  firstProducer$.next(payload);
}

const secondProducer$ = new Subject<any>();
function sendTwo(payload: any) {
  secondProducer$.next(payload);
}

firstProducer$.subscribe(aSubject$);

let subscription: Subscription | null = null;
function demandSubscribe() {
  subscription = secondProducer$.subscribe(aSubject$);
}

function demandUnsubscribe() {
  subscription?.unsubscribe();
  subscription = null;
}

(window as any).sendOne = sendOne;
(window as any).sendTwo = sendTwo;
(window as any).demandSubscribe = demandSubscribe;
(window as any).demandUnsubscribe = demandUnsubscribe;
