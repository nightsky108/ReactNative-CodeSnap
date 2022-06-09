import { BannerAssetFragment } from '../commonFragments';

export const BannerPreviewFragment = `
    fragment BannerPreview on Banner  {
        id
        identifier
        name
        assets {
            ...BannerAsset
        }      
    }
    ${BannerAssetFragment}
`;
export const BannerFragment = `
    fragment Banner on Banner {
        id
        identifier
        name
        page
        sitePath
        assets {
            ...BannerAsset
        }
        adType
        type
        layout
        size {
            width
            height
        }
        time
    }
    ${BannerAssetFragment}
`;
