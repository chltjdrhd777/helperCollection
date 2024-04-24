import Th from '../../Components/Th';
import { ColumnsType } from '../../Table';
import { v4 as uuid } from 'uuid';

export default function getColumnElement<DataType>(nodeTree: ColumnsType<DataType>[]) {
  return () => (
    <>
      {nodeTree.map((nodeList) => (
        <tr key={uuid()}>
          {nodeList.map((node) => {
            const { title, colspan, rowspan, ...rest } = node;
            //추가적인 props 전달에 따른 로직들을 만들어봐야 할 것 같다.

            return (
              <Th key={uuid()} colSpan={colspan} rowSpan={rowspan} {...rest}>
                {title}
              </Th>
            );
          })}
        </tr>
      ))}
    </>
  );
}
