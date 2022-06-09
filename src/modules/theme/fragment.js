import { gql } from '@apollo/client';

import { LiveStreamFragment } from '@modules/liveStream/fragment';
import { AssetFragment, ProductCategoryDetailFragment } from '../commonFragments';

export const ThemePreviewFragment = `
    fragment ThemePreview on Theme {
        id
        name
        start_time
        end_time
        thumbnail {
            ...Asset
        }     
    }
    ${AssetFragment}
`;
export const ThemeDetailFragment = `
  fragment ThemeDetail on Theme {
    id
    name
    thumbnail {
      ...Asset
    }
    hashtags
    order
    productCategories {
      ...ProductCategoryDetail
    }
    brandCategories {
      id
      name
      isRecommended
      hashtags
    }
    brands {
      id
      name
      images {
        ...Asset
      }
      brandCategories {
        id
        name
        isRecommended
        hashtags
      }
      productCategories {
        ...ProductCategoryDetail
      }
    }
    liveStreams {
      ...Livestream
    }
    liveStreamCategories {
      id
      name
      image
      slug
      hashtags
    }
    type
    start_time
    end_time
  }
  ${AssetFragment}
  ${ProductCategoryDetailFragment}
  ${LiveStreamFragment}
`;
