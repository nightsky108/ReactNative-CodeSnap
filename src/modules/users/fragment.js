import { gql } from '@apollo/client';

import { UserPreviewFragment } from '../commonFragments';

export const SellerPreviewFragment = `
    fragment SellerPreview on LiveStream {
        ...UserPreview
    }
    ${UserPreviewFragment}
`;
