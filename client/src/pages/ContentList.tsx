import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  ListData,
  ListQueryString,
  SortBy,
} from 'interfaces/ContentList.interface';
import ListTitle from 'components/ContinentList/ListTitle';
import ListSearch from 'components/ContinentList/ListSearch';
import ListItems from 'components/ContinentList/ListItems';
import customAxios from 'api/customAxios';
import { useParams } from 'react-router-dom';
import Loader from 'components/Loader';

const ContentList = () => {
  const { countryCode } = useParams();
  const preventRef = useRef(true); //중복 실행 방지
  const obsRef = useRef(null); //observer Element
  const endRef = useRef(false); //모든 글 로드 확인
  const [datas, setDatas] = useState<ListData[] | []>([]);
  const [searchDatas, setSearchDatas] = useState<ListData[] | undefined>(
    undefined
  );
  const [searchPage, setSearchPage] = useState<number>(1);
  const [sortData, setSortData] = useState<SortBy>({
    value: '작성날짜 (최신순)',
    sortBy: 'createdAt',
    sortDir: 'DESC',
  });
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const handleSize = () => {
    const width = window.innerWidth;
    if (width < 620) {
      return 3;
    } else if (width < 922) {
      return 4;
    } else if (width < 1200) {
      return 6;
    } else {
      return 8;
    }
  };

  const [size, setSize] = useState<number>(handleSize());

  const handleWindowResize = () => {
    setSize(handleSize());
  };

  const getContentData = async (page: number, size: number) => {
    const params: ListQueryString = {
      page,
      size,
      sortDir: sortData.sortDir,
      sortBy: sortData.sortBy,
      nationCode: countryCode,
    };

    await customAxios
      .get('/companions/nations', {
        params,
      })
      .then(resp => {
        setDatas([...datas, ...resp.data.data]);
        setIsLoading(false);
        preventRef.current = true;
        console.log(resp.data);

        if (resp.data.pageInfo.totalPages === resp.data.pageInfo.page) {
          endRef.current = true;
        }
      });
  };

  useEffect(() => {
    console.log('render');
    if (searchDatas !== undefined) {
      console.log('search render');
      endRef.current = false;
      preventRef.current = true;
      setDatas([...searchDatas]);
      setPage(1);
    } else {
      endRef.current = false;
      if (searchPage !== 1) {
        setSearchPage(1);
        setDatas([]);
        setIsLoading(true);
      }
      getContentData(page, size);
    }
  }, [sortData, searchDatas, page, searchPage]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    handleSize();
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const obsHandler = (entries: any) => {
    const target = entries[0];
    console.log('observer', isSearch);
    console.log(endRef.current, target.isIntersecting, preventRef.current);

    if (!endRef.current && target.isIntersecting && preventRef.current) {
      //옵저버 중복 실행 방지
      // preventRef.current = false; //옵저버 중복 실행 방지
      if (!isSearch) {
        preventRef.current = false; //옵저버 중복 실행 방지
        setPage(prev => prev + 1); //페이지 값 증가
      } else {
        console.log('searchPage up');
        preventRef.current = false; //옵저버 중복 실행 방지
        setSearchPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(obsHandler, { threshold: 0.5 });
    if (obsRef.current) observer.observe(obsRef.current);
    return () => {
      observer.disconnect();
    };
  }, [isSearch]);

  return (
    <Container>
      <ListTitle />
      <ListSearch
        searchDatas={searchDatas}
        setSearchDatas={setSearchDatas}
        size={size}
        sortData={sortData}
        searchPage={searchPage}
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        endRef={endRef}
      />
      <ListItems listData={datas} setSortData={setSortData} />
      {isLoading && <Loader />}
      <Observer ref={obsRef}>OBSERVER</Observer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: calc(100vh - 60px);
`;

const Observer = styled.div`
  position: absolute;
  width: 100%;
  bottom: -30px;
`;

export default ContentList;
