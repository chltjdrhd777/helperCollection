import { ColumnTree } from '../../Components/Columns';
import { ColumnsType, ColumnType } from '../../Table';

// span property 채우는 로직 컨셉
// 1. colspan = children이 존재할 때, 해당 children.length > 1이면 그 자식 길이만큼 존재함. (children이 없을 경우, 존재하지 않음)
// 2. rowspan = children이 존재하면 없음. children.length가 0일 때, depth(childrenToColumns 알고리즘 참조)에 대해서
// maxDepth - currentDepth > 0 라면,  maxDepth - currentDepth + 1 이 해당 노드가 지녀야 하는 row span이 된다.

//types ///////////////////////////////////////////////////////////////////////////////
interface CalculateSpanParamType<DataType> {
  columnTree: ColumnTree<DataType>;
}
interface AddSpanParamType<DataType> {
  columns: ColumnsType<DataType>;
  maxDepth: number;
  currentDepth: number;
}
//types ///////////////////////////////////////////////////////////////////////////////

export function calculateSpan<DataType>({
  columnTree,
}: CalculateSpanParamType<DataType>): ColumnTree<DataType> {
  const addSpan = ({ columns, maxDepth, currentDepth }: AddSpanParamType<DataType>) => {
    const getMaxChildrenLength = (column: ColumnType<DataType>) => {
      let result = [column] as ColumnsType<DataType> | ColumnTree<DataType>;

      if (column.children) {
        result = [...column.children.map((child) => getMaxChildrenLength(child))] as typeof result;
      }

      return result.flat();
    };

    return columns.map((column) => {
      const childrenLength = Number(column?.children?.length ?? 0);

      //colspan 계산
      if (childrenLength > 1) {
        column.colspan = getMaxChildrenLength(column).length;
      }

      //rowspan 계산
      if (childrenLength === 0) {
        const depthDiff = maxDepth - currentDepth;

        if (depthDiff > 0) {
          column.rowspan = depthDiff + 1;
        }
      }

      return column;
    });
  };

  return columnTree.map((columns, currentDepth) => {
    return addSpan({ columns, maxDepth: columnTree.length - 1, currentDepth });
  });
}
