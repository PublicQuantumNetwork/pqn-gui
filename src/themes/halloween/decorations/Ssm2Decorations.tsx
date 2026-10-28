'use client';

import {
  Bats,
  CourierBat,
  CourierGhost,
  DeclinedEnvelope,
  FriendComputer,
  GhostSad,
  MessagePath,
  Moon,
  Pumpkin,
  Spider,
  Web,
  spiderLeft,
} from './ambient';
import { MonsterCat, MonsterFrank, MonsterFuzz, SadPumpkin } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the ssm2 Scenes' Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the spider keeps its
 *  board's own gap from its right edge) and pose (the board leans its
 *  pumpkin out from under it), and the status the page shows while the
 *  friend decides (the spinner while waiting, the declined face once the
 *  friend said no) — the spot each board draws its waiting content
 *  around. */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const statusAnchor = () =>
  document.querySelector('[data-decoration-anchor="ssm2-status"]');

/** What the three SSM2 boards each draw their own: the spider's place and
 *  timing (SSM2.dc.html, SSM2-waiting.dc.html and
 *  SSM2-declined.dc.html). */
type Ssm2Board = 'asking' | 'waiting' | 'declined';

const boards: Record<
  Ssm2Board,
  { spiderAt: number; thread: number; bob: string }
> = {
  asking: { spiderAt: 0.38, thread: 84, bob: '3.8s' },
  waiting: { spiderAt: 0.47, thread: 104, bob: '3.2s' },
  declined: { spiderAt: 0.41, thread: 140, bob: '4.2s' },
};

/**
 * The ssm2 Scenes' Decorations (docs/design/halloween/SSM2.dc.html and its
 * waiting and declined boards): the stage's ambient set — web, moon, bats,
 * the spider on its own thread and the flickering pumpkin under Whobit's
 * pose — plus each board's own waiting pieces, placed against the status as
 * the page lays it out, in the board's own 560px communication box: the
 * asking board's dashed flight path with the bat courier above the status
 * and the fuzz ball popping up from the stage's bottom (clamped past the
 * pose pumpkin beside it, as the CHSH2 pot is); the waiting board's cat on
 * the friend's computer with its popup light blinking and the ghost
 * courier; the declined board's sad pumpkin (the declined face's box cut
 * out of it), the crossed-out envelope, the sad ghost and the monster
 * leaning in from the stage's right edge. The asking board hangs its
 * spider behind the bubble's right edge, so the bubble is cut out of it
 * here, and draws the status over its flight path's lower corner, so the
 * status is cut out of that too (agent decision A8).
 */
function Ssm2Decorations({ board }: { board: Ssm2Board }) {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const status = useElementBox(statusAnchor);
  if (!stage || !bubble || !pose) {
    return null;
  }
  const { spiderAt, thread, bob } = boards[board];
  // The board's own 560px communication box, derived from the status as its
  // own board lays that out — the asking and waiting boards sit their status
  // 280px and 330px down its middle; the declined board carries no status,
  // so its box is centred on the declined face the GUI lays in that spot —
  // clamped to the stage's top edge, which the board never draws above (the
  // GUI lays the status higher than the board's own).
  const box: { left: number; top: number } | null = status
    ? board === 'asking'
      ? {
          left: status.left + status.width / 2 - 280,
          top: Math.max(status.top - 280, stage.top),
        }
      : board === 'waiting'
        ? {
            left: status.left + status.width / 2 - 280,
            top: Math.max(status.top - 330, stage.top),
          }
        : {
            left: status.left + status.width / 2 - 280,
            top: status.top + status.height / 2 - 280,
          }
    : null;
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Bats stage={stage} />
      <Spider
        left={spiderLeft(stage, bubble, spiderAt)}
        top={stage.top}
        threadHeight={thread}
        bobDuration={bob}
        occluders={board === 'asking' && status ? [bubble] : undefined}
      />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      {board === 'asking' && status && box && (
        <>
          <MessagePath box={box} occluders={[status]} />
          <CourierBat left={box.left + 150} top={box.top + 40} />
        </>
      )}
      {board === 'asking' && (
        <MonsterFuzz
          left={Math.max(
            stage.left + stage.width * 0.33,
            pose.left + 258 + 120
          )}
          bottom={stage.bottom}
        />
      )}
      {board === 'waiting' && status && box && (
        <>
          <MonsterCat left={box.left + 404} top={box.top + 30} />
          <FriendComputer box={box} occluders={[status]} />
          <CourierGhost left={box.left + 120} top={box.top + 70} />
        </>
      )}
      {board === 'declined' && status && box && (
        <>
          <SadPumpkin
            left={box.left + 140}
            top={box.top + 40}
            occluders={[status]}
          />
          <DeclinedEnvelope left={box.left + 404} top={box.top + 252} />
          <GhostSad
            left={box.left + 20}
            top={box.top + 120}
            width={84}
            height={100}
          />
        </>
      )}
      {board === 'declined' && <MonsterFrank stage={stage} />}
    </>
  );
}

/** The ssm2-asking Scene: the fuzz ball popping up while the request to the
 *  friend is on its way. */
export function Ssm2AskingDecorations() {
  return <Ssm2Decorations board="asking" />;
}

/** The ssm2-waiting Scene: the cat and the ghost courier once the request
 *  has been answered without an answer. */
export function Ssm2WaitingDecorations() {
  return <Ssm2Decorations board="waiting" />;
}

/** The ssm2-declined Scene: the sad pumpkin, the crossed-out envelope, the
 *  sad ghost and the leaning monster. */
export function Ssm2DeclinedDecorations() {
  return <Ssm2Decorations board="declined" />;
}
