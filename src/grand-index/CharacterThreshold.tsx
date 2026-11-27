import { Component, createRef, Fragment, type ComponentPropsWithoutRef } from 'react';
import { motionTokens } from '../motion/system';

type Position = { x: number; y: number; size: number };
type Identity = {
  title: Position;
  parts: Position[];
  lines: string;
  grouped: boolean;
};
type Props = ComponentPropsWithoutRef<'div'> & {
  expanded: boolean;
  subject?: string;
  reduced: boolean;
};

// Read the visible identity before React switches layouts, including any travel still in progress.
export class CharacterThreshold extends Component<Props, Record<string, never>, Identity | null> {
  private exhibit = createRef<HTMLDivElement>();
  private travel?: { caption: Element; animations: Animation[] };

  private caption(expanded: boolean) {
    return this.exhibit.current!.querySelector(expanded ? '.character-caption' : '.featured-caption')!;
  }

  private measure(caption: Element) {
    const exhibit = this.exhibit.current!;
    const frame = exhibit.getBoundingClientRect();
    const heading = caption.querySelector<HTMLElement>('h3')!;
    const elements = Array.from(caption.querySelectorAll<HTMLElement>('[data-identity-travel]'));
    const position = (element: HTMLElement) => {
      const bounds = element.getBoundingClientRect();
      const { fontSize, transform } = getComputedStyle(element);
      const scale = transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).a;
      return { x: bounds.left - frame.left, y: bounds.top - frame.top, size: parseFloat(fontSize) * scale };
    };
    const title = position(heading);
    const parts = elements.map(position);
    const lines = parts.slice(0, -1).map(word => Math.round((word.y - parts[0].y) / title.size)).join(',');
    const grouped = caption.hasAttribute('data-scroll-all') || getComputedStyle(heading).transform !== 'none'
      || heading.getBoundingClientRect().bottom > caption.getBoundingClientRect().bottom;
    return { frame, heading, elements, identity: { title, parts, lines, grouped } };
  }

  getSnapshotBeforeUpdate(previous: Props) {
    if (previous.expanded === this.props.expanded || this.props.reduced || !previous.subject
      || previous.subject !== this.props.subject) return null;
    const caption = this.caption(previous.expanded);
    const { frame, identity } = this.measure(caption);
    if (frame.bottom <= 0 || frame.top >= innerHeight || caption.closest('.domain-room[inert]')) return null;
    // A scrolled-out name has no visible origin.
    if (identity.parts[0]?.y < caption.getBoundingClientRect().top - frame.top - 2) return null;
    return identity;
  }

  componentDidUpdate(previous: Props, _state: unknown, start: Identity | null) {
    if (previous.expanded !== this.props.expanded || this.props.reduced || previous.subject !== this.props.subject) this.cancelTravel();
    if (!start) return;
    const caption = this.caption(this.props.expanded);
    if (caption.closest('.domain-room[inert]')) return;

    // The identity can pass above its reading territory during the return.
    caption.setAttribute('data-identity-travelling', '');
    const { heading, elements, identity: end } = this.measure(caption);
    if (start.parts.length !== elements.length) {
      caption.removeAttribute('data-identity-travelling');
      return;
    }
    const timing = { duration: motionTokens.settle * 1000, easing: `cubic-bezier(${motionTokens.ease.join(',')})` };
    const animate = (element: HTMLElement, from: Position, to: Position) =>
      element.animate([
        { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.size / to.size})` },
        { transform: 'none' },
      ], timing);

    // Where lines reflow, carry a readable heading as a block and keep the rank below it.
    let animations: Animation[];
    if (start.grouped || end.grouped || start.lines !== end.lines) {
      const rank = end.parts.at(-1)!;
      const scale = start.title.size / end.title.size;
      const rankOrigin = {
        x: start.title.x + (rank.x - end.title.x) * scale,
        y: start.title.y + (rank.y - end.title.y) * scale,
        size: rank.size * scale,
      };
      animations = [animate(heading, start.title, end.title), animate(elements.at(-1)!, rankOrigin, rank)];
    } else {
      animations = elements.map((element, index) => animate(element, start.parts[index], end.parts[index]));
    }
    const travel = { caption, animations };
    this.travel = travel;
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (this.travel === travel) this.cancelTravel();
    }, () => {});
  }

  private cancelTravel = () => {
    this.travel?.caption.removeAttribute('data-identity-travelling');
    this.travel?.animations.forEach(animation => animation.cancel());
    this.travel = undefined;
  };

  componentDidMount() {
    window.addEventListener('resize', this.cancelTravel);
    document.fonts.addEventListener('loadingdone', this.cancelTravel);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.cancelTravel);
    document.fonts.removeEventListener('loadingdone', this.cancelTravel);
    this.cancelTravel();
  }

  render() {
    const { expanded, subject, reduced, ...attributes } = this.props;
    return <div {...attributes} ref={this.exhibit} data-expanded={expanded}/>;
  }
}

export function CharacterName({ name, expanded }: { name: string; expanded?: boolean }) {
  return <h3 aria-level={expanded ? 2 : 3}>{name.split(/(\s+)/).map((part, index) =>
    <Fragment key={index}>{index % 2 ? part : <span data-identity-travel>{part}</span>}</Fragment>)}</h3>;
}
