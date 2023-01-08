/**
 * It returns the number of pages needed to display a given number of items, given the number of items
 * per page.
 * @param total - The total number of items in the collection.
 * @param perPage - The number of items you want to show per page.
 * @returns The number of pages.
 */
function numberOfPages (total, perPage) {
  if (total == 0 || perPage == 0)
    return 0;
  
  return Math.ceil(total/perPage);
}

module.exports = numberOfPages;