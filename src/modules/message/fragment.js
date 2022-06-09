import { gql } from '@apollo/client';

import { AssetFragment, UserPreviewFragment } from '../commonFragments';

//= =====message fragment=======================
export const MessageFragment = `
    fragment Message on Message {
        id
        thread {
           id
        }
        author {
            ...UserPreview
        }
        type
        data
        createdAt        
        videoTime
        isRead
    }
    ${UserPreviewFragment}
`;
export const MessageThreadFragment = `
    fragment MessageThread on MessageThread {
        id
        tags
        participants {
            ...UserPreview
        }
        messages {
            ...Message
        }
        status {
            hidden
            muted
        },
        unreadMessages
    }
    ${UserPreviewFragment}
    ${MessageFragment}
`;
