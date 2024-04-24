import { StyledTableProps, useTableContext } from '../../Table';
import { DEFAULT_SCROLL_WIDTH } from '../../constants/scroll';
import { UseUpdateCellSpacingParams } from '../../hooks/Columns/useUpdateCellSpacing';

//types ///////////////////////////////////////////////////////////////////////////////
interface UpdateCellSpacingParams<DataType>
  extends StyledTableProps,
    Partial<ReturnType<typeof useTableContext>>,
    Omit<UseUpdateCellSpacingParams<DataType>, 'ref'> {
  el: HTMLTableCellElement | null;
  setTableCellSpacing: React.Dispatch<React.SetStateAction<Map<number, number>>>;
}
//types ///////////////////////////////////////////////////////////////////////////////

export function updateYCellSpacing<DataType>({
  el,
  title,
  dataIndex,
  isDataIndexColumn,
  setTableCellSpacing,
  dataIndexTree,
  isScrollable,
  isContentOverflow,
}: UpdateCellSpacingParams<DataType>) {
  const isShouldUpdateYCellSpacing = el && dataIndex && isDataIndexColumn;

  if (!isShouldUpdateYCellSpacing) {
    return;
  }

  const currentColumnWidth = el.getBoundingClientRect().width ?? 0;
  const spacingIdx = dataIndexTree.findIndex(
    // Column은 map을 통해 랜덤으로 들어오지만, dataIndex(row의 기준이 되는 dataIndex column)은 순서가 정해져 있으므로
    // 어느 spacing에 column width를 삽입해야 하는 지 결정해야 한다.
    (tree) => tree.dataIndex === dataIndex && tree.title === title,
  );

  // 만약 마지막 dataIndex column일 경우, custsom scroll width가 존재한다면 그만큼의 width를 빼 주어야 한다.
  const y = isScrollable?.y;
  const $customStyles = typeof y === 'object' ? y.$customStyles : null;
  const scrollWidth = typeof y === 'object' ? y.scrollWidth ?? DEFAULT_SCROLL_WIDTH : 0;

  const isLastSpacingIdx = spacingIdx === dataIndexTree.length - 1;
  const isScrollYEnabled = typeof y === 'object' ? y.enabled : y;

  const isSholudScrollYShown = isScrollYEnabled && isContentOverflow?.y;
  const yScrollWidth = !$customStyles ? 0 : scrollWidth;

  const width =
    isSholudScrollYShown && isLastSpacingIdx
      ? currentColumnWidth - yScrollWidth
      : currentColumnWidth;

  setTableCellSpacing((prev) => {
    const copied = new Map(prev);
    copied.set(spacingIdx, width);
    return copied;
  });
}
