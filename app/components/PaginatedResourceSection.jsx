import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>

            {/* PRODUCTS */}
            {resourcesClassName ? (
              <div className={resourcesClassName}>
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}

            {/* ONLY BOTTOM PAGINATION */}
            <div className="pagination-wrapper">
              <PreviousLink className="page-btn prev">
                {isLoading ? 'Loading...' : '← Previous'}
              </PreviousLink>

              <NextLink className="page-btn next">
                {isLoading ? 'Loading...' : 'Next →'}
              </NextLink>
            </div>

          </div>
        );
      }}
    </Pagination>
  );
}
