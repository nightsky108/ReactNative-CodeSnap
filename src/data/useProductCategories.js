import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import _ from 'lodash';

import {
  FETCH_FULL_PRODUCT_CATEGORY_PREVIEWS,
  FETCH_PRODUCT_CATEGORY_PREVIEWS,
} from '@modules/product/graphql';

export const useFullProductCategories = () => {
  const {
    data: productFullCategoryPreviewsData,
    loading,
    error,
  } = useQuery(FETCH_FULL_PRODUCT_CATEGORY_PREVIEWS, {
    fetchPolicy: 'cache-first',
    variables: {
      hasProduct: false,
    },
  });

  const { fullProductCategoryIds, fullProductCategories } = useMemo(() => {
    if (!productFullCategoryPreviewsData) {
      return {
        fullProductCategoryIds: [],
        fullProductCategories: [],
      };
    } else {
      const topLevelCat = _.filter(
        productFullCategoryPreviewsData?.fullProductCategories,
        item => item.level === 1,
      );
      const middleLevelCat = _.filter(
        productFullCategoryPreviewsData?.fullProductCategories,
        item => item.level === 2,
      );
      const lowLevelCat = _.filter(
        productFullCategoryPreviewsData?.fullProductCategories,
        item => item.level === 3,
      );

      const fullList = {};
      _.map(topLevelCat, item => {
        fullList[item.id] = { ...item, children: {} };
      });
      _.map(middleLevelCat, item => {
        if (fullList[item.parent.id]) {
          fullList[item.parent.id].children[item.id] = { ...item, children: {} };
        }
      });

      _.map(lowLevelCat, item => {
        const topParentID = _.findLast(item.parents, p => p.level === 1).id;
        const subParentID = _.findLast(item.parents, p => p.level === 2).id;
        if (fullList[topParentID] && fullList[topParentID].children[subParentID]) {
          fullList[topParentID].children[subParentID].children[item.id] = {
            ...item,
          };
        }
      });

      return {
        fullProductCategoryIds: _.map(
          productFullCategoryPreviewsData?.fullProductCategories,
          item => {
            return { id: item?.id, name: item?.name };
          },
        ),
        fullProductCategories: fullList,
      };
    }
  }, [productFullCategoryPreviewsData]);

  return { fullProductCategoryIds, fullProductCategories, loading, error };
};
export const useTopProductCategories = () => {
  const { data: productCategoryPreviewsData } = useQuery(FETCH_PRODUCT_CATEGORY_PREVIEWS, {
    variables: {
      hasProduct: false,
    },
  });

  const topProductCategories = useMemo(() => {
    if (!productCategoryPreviewsData) {
      return [];
    } else {
      return productCategoryPreviewsData?.productCategories || [];
    }
  }, [productCategoryPreviewsData]);

  return { topProductCategories };
};
