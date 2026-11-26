import { Fragment, createElement, type ReactNode } from 'react';
import { marked, type Token, type Tokens } from 'marked';

export interface DocumentHeading { id: string; label: string; depth: number }

function plain(tokens: Token[] = []): string {
  return tokens.map(token => 'tokens' in token && token.tokens ? plain(token.tokens) : 'text' in token ? token.text : '').join('');
}

// Build the contents and the React document in the same traversal.
export function parseDossier(source: string) {
  const headings: DocumentHeading[] = [];
  const ids = new Set<string>();
  function children(tokens: Token[] = []): ReactNode {
    return tokens.map((token, index) => <Fragment key={index}>{render(token)}</Fragment>);
  }
  function render(token: Token): ReactNode {
    switch (token.type) {
      case 'heading': {
        const label = plain(token.tokens);
        const slug = label.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
        let id = slug;
        for (let suffix = 2; ids.has(id); suffix++) id = slug + '-' + suffix;
        ids.add(id);
        headings.push({ id, label, depth: token.depth });
        return createElement('h' + token.depth, { id: 'dossier-' + id, tabIndex: -1 }, children(token.tokens));
      }
      case 'list': {
        const items = token.items.map((item: Tokens.ListItem, i: number) => <li key={i}>{children(item.tokens)}</li>);
        return token.ordered ? <ol start={Number(token.start)}>{items}</ol> : <ul>{items}</ul>;
      }
      case 'table': {
        const cells = (row: Tokens.TableCell[]) => row.map((cell, i) => createElement(cell.header ? 'th' : 'td',
          { key: i, scope: cell.header ? 'col' : undefined, style: { textAlign: cell.align ?? undefined } }, children(cell.tokens)));
        return <div className="dossier-table" tabIndex={0}><table><thead><tr>{cells(token.header)}</tr></thead>
          <tbody>{token.rows.map((row: Tokens.TableCell[], i: number) => <tr key={i}>{cells(row)}</tr>)}</tbody></table></div>;
      }
      case 'paragraph': return <p>{children(token.tokens)}</p>;
      case 'blockquote': return <blockquote>{children(token.tokens)}</blockquote>;
      case 'strong': case 'em': case 'del': return createElement(token.type, null, children(token.tokens));
      case 'link': {
        const href: string = token.href;
        const label = children(token.tokens);
        if (href.startsWith('#') && !href.startsWith('#/')) return <a href={location.hash.split('?')[0] + '?heading=' + encodeURIComponent(href.slice(1))} data-document-link={href.slice(1)}>{label}</a>;
        return /^(https?:\/\/|mailto:|#\/)/i.test(href) ? <a href={href}>{label}</a> : label;
      }
      case 'code': return <pre><code>{token.text}</code></pre>;
      case 'codespan': return <code>{token.text}</code>;
      case 'hr': return <hr/>;
      case 'br': return <br/>;
      case 'text': return token.tokens ? children(token.tokens) : token.text;
      case 'image': case 'html': case 'escape': return token.text;
      default: return null;
    }
  }
  return { body: children(marked.lexer(source)), headings };
}
