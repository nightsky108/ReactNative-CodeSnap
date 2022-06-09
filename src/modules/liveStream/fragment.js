import { gql } from '@apollo/client';

import { ProductPreviewFragment } from '@modules/product/fragment';
import { MessageThreadFragment } from '@modules/message/fragment';

import { AssetFragment, UserPreviewFragment } from '../commonFragments';

export const LiveStreamStatsFragment = `
    fragment LiveStreamStats on LiveStreamStats {
        duration
        likes
        viewers
    }
`;
export const LiveStreamExperiencePreviewFragment = `
    fragment LiveStreamExperiencePreview on LiveStreamExperience {
        id
        name(locale: $locale)
        description
        image        
    }
`;

export const LiveStreamCategoryPreviewFragment = `
    fragment LiveStreamCategoryPreview on LiveStreamCategory {
        id
        name(locale: $locale)
        image
    }
`;
export const LiveStreamCategoryInfoFragment = `
    fragment LiveStreamCategoryInfo on LiveStreamCategory {
        ...LiveStreamCategoryPreview
        hashtags        
    }
    ${LiveStreamCategoryPreviewFragment}
`;
export const LiveStreamPreviewFragment = `
    fragment LiveStreamPreview on LiveStream {
        id
        title
        streamer {
            ...UserPreview
        }
        preview {
            ...Asset
        }      
        thumbnail {
            ...Asset
        }
        channel {
            id
            status
            type
        }
        statistics {
            ...LiveStreamStats
        }
        views
        likes
    }
    ${UserPreviewFragment}
    ${LiveStreamStatsFragment}
    ${AssetFragment}
`;
export const StreamChannelFragment = `
    fragment StreamChannel on StreamChannel {
        id
        status
        token
        startedAt
        finishedAt     
        record {
            enabled
            status
            sources {      
                user {
                    id
                }          
                type
                source
                prerecorded
            }
        }
    }
`;
export const LiveStreamFragment = `
    fragment LiveStream on LiveStream {
        id
        title
        preview {
            ...Asset
        }      
        isLiked
        channel {
            ...StreamChannel
        }
        thumbnail {
            ...Asset
        }
        streamer {
            ...UserPreview
        }
        products {
            ...ProductPreview           
        }       
        publicMessageThread {
            ...MessageThread
        }
        privateMessageThreads {
            ...MessageThread
        }
        statistics {
            ...LiveStreamStats
        }
		likes
		views
    }
    ${AssetFragment}
    ${MessageThreadFragment}
    ${ProductPreviewFragment}
    ${StreamChannelFragment}
    ${LiveStreamStatsFragment}
    ${UserPreviewFragment}
`;
