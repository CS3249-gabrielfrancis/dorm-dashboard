import React from 'react';
import RecordDisplay from './RecordDisplay'
import RoomDisplay from './RoomDisplay'
import { DatasCollection } from '../api/datas';
import { useTracker } from 'meteor/react-meteor-data';

export default function App() {
  // useTracker update datas automatically when db is changed
  const datas = useTracker(() => {
    const datas = DatasCollection.find().fetch()
    return datas;
  });

  return(
    <div className="content_wrapper">
      <RecordDisplay datas={datas} />
      <RoomDisplay />
    </div>
  );
}