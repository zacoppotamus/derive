import {
  fromDOMEvent,
  fromInterval,
  fromRAF,
  sidechainToggle,
  stream,
  sync
} from "@thi.ng/rstream";

import { add, map, mapcat, scan } from "@thi.ng/transducers";

// export const keyStreamConditional = fromDOMEvent(document, "keyup").transform(
//   mapcat(x => [x.key, null])
// );

export const mouseStreamConditional = fromDOMEvent(
  document,
  "mousemove"
).transform(mapcat(x => [x.screenX, x.screenY]));

export const intervalStream = fromInterval(1000);

export const animationStream = stream<boolean>();

export const frameStreamConditional = fromRAF()
  .subscribe(sidechainToggle<number, boolean>(animationStream))
  .transform(
    map(() => 1),
    scan(add())
  );

export const mainStream = sync<any, any>({
  src: {
    animationValue: animationStream,
    frameValue: frameStreamConditional,
    keyValue: keyStreamConditional
    mouseValue: 
  }
});