import React from 'react';
import RecordDisplay from './RecordDisplay'
import RoomDisplay from './RoomDisplay'
import { DatasCollection } from '../api/datas';
import { useTracker } from 'meteor/react-meteor-data';

export default function App() {
  // useTracker update datas automatically when db is changed
  const datas = useTracker(() => {
    return DatasCollection.find().fetch();
  });

  return(
    <div className="content_wrapper">
      <RecordDisplay numData={datas.length} />
      <RoomDisplay />
    </div>
  );
}