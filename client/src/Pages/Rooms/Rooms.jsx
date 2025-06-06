
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRooms } from "../../features/room/roomSlice";
import RoomList from "../../component/RoomList/RoomList";
import { Helmet } from "react-helmet";

const Rooms = () => {
  const dispatch = useDispatch();
  const { rooms } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  return (
    <div className="container">
      <Helmet>
        <title>Rooms</title>
      </Helmet>
      <h1 className="heading center">Rooms</h1>
      <RoomList data={rooms} />
    </div>
  );
};

export default Rooms;