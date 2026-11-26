import { createRoot } from 'react-dom/client';
import { PublicationImage, isAssetId, preloadImage, prepareImage } from '../../src/images/publication';

const id: unknown = 'editorial-diagram';
if (!isAssetId(id)) throw Error('Missing fixture registration');
preloadImage(id, '160px');
Object.assign(window, { isAssetId, prepareDiagram: (signal?: AbortSignal) => prepareImage(id, '160px', signal) });
createRoot(document.body.appendChild(document.createElement('main'))).render(<figure>
  <PublicationImage asset={id} alt="Two connected reading rooms" sizes="160px"
    loading="eager" style={{ width: 160, height: 'auto' }}/>
  <PublicationImage asset={id} alt="" sizes="160px" fit="contain" focalPoint="25% 75%"
    style={{ width: 160, height: 160 }}/>
</figure>);
