import { ReactElement } from 'react';
import { ColumnType, ColumnsType } from '../../Table';

//types ///////////////////////////////////////////////////////////////////////////////
export type NodePropsType<DataType> = ColumnType<DataType> & { children?: ReactNodeType<DataType> };
export type BaseReactNodeType<DataType> = ReactElement<NodePropsType<DataType>>;
export type ReactNodeType<DataType> = BaseReactNodeType<DataType> | BaseReactNodeType<DataType>[];

export type ColumnNodeType<DataType> = NodePropsType<DataType> | NodePropsType<DataType>[];

export type ChildrenToClumnsReturnType<DataType> =
  | ColumnNodeType<DataType>
  | BaseReactNodeType<DataType>[];
//types ///////////////////////////////////////////////////////////////////////////////

// children은 valid 한 react element이거나 해당 react element의 배열일 수 있다
// 해야 하는 목표는 해당 children의 타입에 따라서, props만 남기고 나머지는 버리는 것이다.

// case 1. children이 배열이 아닐 경우
// 이 때에는 props만 남기고, 혹시 children이 있을 경우 재귀적으로 다시 해당 작업을 반복해야 한다

// case 2. children이 배열일 경우
// 이 때에는 children을 순회하면서 각각에 대해서 다시 childrenToColumns를 호출해야 한다.

export default function childrenToColumns<DataType>(
  reactNode: ReactNodeType<DataType>,
): ChildrenToClumnsReturnType<DataType> | void {
  // 해당 함수는 children이 존재해야만 호출되도록 로직이 작성되어 있으므로, children 검증은 하지 않았다.

  if (Array.isArray(reactNode)) {
    return reactNode.map((node) => childrenToColumns(node)) as ChildrenToClumnsReturnType<DataType>;
  } else {
    // 재귀 종료조건
    if (!reactNode.props) return;

    const { children, ...restProps } = reactNode.props;
    const nodeProps = { ...restProps } as NodePropsType<DataType>;

    if (children) {
      const recursiveChildren = childrenToColumns(children);

      if (recursiveChildren) {
        nodeProps.children = Array.isArray(recursiveChildren)
          ? recursiveChildren
          : ([recursiveChildren] as any[]);
      }
    }

    return nodeProps;
  }
}
