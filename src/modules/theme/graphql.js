import { gql } from '@apollo/client';

import { ThemePreviewFragment } from './fragment';
import { PagerFragment } from '../commonFragments';

export const FETCH_THEME_PREVIEWS = gql`
  query fetchThemePreviews(
    $searchQuery: String
    $themeType: ThemeType
    $themeTime: Date
    $feature: ThemeSortFeature! = CREATED_AT
    $sortType: SortTypeEnum! = DESC
    $skip: Int
    $limit: Int
  ) {
    themes(
      filter: { searchQuery: $searchQuery, type: $themeType, time: $themeTime }
      sort: { feature: $feature, type: $sortType }
      page: { skip: $skip, limit: $limit }
    ) {
      collection {
        ...ThemePreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${ThemePreviewFragment}
  ${PagerFragment}
`;
export const FETCH_THEMES = gql`
  query fetchThemes(
    $searchQuery: String
    $themeType: ThemeType
    $themeTime: Date
    $feature: ThemeSortFeature! = CREATED_AT
    $sortType: SortTypeEnum! = DESC
    $skip: Int
    $limit: Int
  ) {
    themes(
      filter: { searchQuery: $searchQuery, type: $themeType, time: $themeTime }
      sort: { feature: $feature, type: $sortType }
      page: { skip: $skip, limit: $limit }
    ) {
      collection {
        ...ThemePreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${ThemePreviewFragment}
  ${PagerFragment}
`;
