import styled from 'styled-components';
import { ListData } from 'interfaces/ContentList.interface';
import { getDateString } from 'utils/getDateString';

interface Props {
  listData: ListData[];
}

const ListItems = ({ listData }: Props) => {
  console.log(listData);
  return (
    <ItemListsContainer>
      {listData.map(item => (
        <ListItem key={item.companionId}>
          <h1>{getDateString(item.date).shortDateStr}</h1>
          <div>
            <span></span>
            <p>{item.address}</p>
          </div>
          <p>{item.title}</p>
          <ul>
            {item.tags.map((tag, idx) => (
              <li key={idx}>{tag}</li>
            ))}
          </ul>
        </ListItem>
      ))}
    </ItemListsContainer>
  );
};

const ItemListsContainer = styled.section`
  width: 80%;
  border: 3px dotted pink;
  height: fit-content;
  padding: 20px;
  padding-top: 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding-top: 80px;
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ListItem = styled.article`
  width: 100%;
  border: 2px solid red;
  transition: 0.5s;
`;

export default ListItems;