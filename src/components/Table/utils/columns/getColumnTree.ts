import { ColumnType, ColumnsType } from '../../Table';
import { calculateSpan } from './calculateSpan';

//types ///////////////////////////////////////////////////////////////////////////////
export interface RecursiveParamType<DataType> {
  columns: (ColumnType<DataType> & { isDataIndexColumn?: boolean; childrenSum?: number })[];
  columnTree: ColumnsType<DataType>[];
  depth: number;
}
export type GetColumnsParamType<DataType> = Pick<RecursiveParamType<DataType>, 'columns'>;
//types ///////////////////////////////////////////////////////////////////////////////

export default function getColumnTree<DataType>({ columns }: GetColumnsParamType<DataType>) {
  const columnTree: ColumnsType<DataType>[] = [];
  const dataIndexTree: ColumnsType<DataType> = []; //row 매칭을 위한 column 마지막 줄 계산

  const recursiveColumnTree = ({ columns, columnTree, depth }: RecursiveParamType<DataType>) => {
    if (columns.length === 0) return;

    // column tree 계산
    columns.forEach((column) => {
      const slot: undefined | ColumnsType<DataType> = columnTree[depth];
      if (!column?.children) {
        column.isDataIndexColumn = true;
        dataIndexTree.push(column); //DFS
      }

      if (!slot) {
        columnTree[depth] = [column];
      } else {
        columnTree[depth].push(column);
      }

      column?.children &&
        recursiveColumnTree({ columns: column?.children ?? [], columnTree, depth: depth + 1 });
    });
  };

  // 전달받은 columns를 랜더링을 위한 트리 구조로 전환.
  columns.forEach((column) => {
    recursiveColumnTree({
      columns: [column],
      columnTree,
      depth: 0,
    });
  });

  // column tree에 colspan & rowspan 계산
  calculateSpan({ columnTree });

  return {
    columnTree,
    dataIndexTree,
  };
}

// 1. columns는 1차적 깊이의 노드 객체 배열이다.
// 2. columns를 순회하면서 재귀적으로 result를 업데이트 시킨 후, 이를 리턴한다.

// 업데이트 순서
// 3. 예를 들어, columns[0]의 기준으로 생각해보면, result에 조건에 따라 삽입해놓고
// 4. node children의 유무에 따라서 재귀적으로 해당 과정을 반복한다 (result reference를 계속 전달해서 업데이트)
// 5. 결론적으로 tr depth 구조에 따른 정렬된 노드 배열이 리턴된다.
