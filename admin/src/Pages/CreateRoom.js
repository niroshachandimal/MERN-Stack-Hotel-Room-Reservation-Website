// FILE: CreateRoom.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../helper/utils";
import { createRoom, reset, getRooms } from "../features/room/roomSlice";
import "./CreateRoom.scss";
import { Helmet } from "react-helmet";

const CreateRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.room);

  const [files, setFiles] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    roomNumbers: "",
    roomCount: "",
    discountPrice: "",
  });

  const { name, price, desc, roomNumbers, roomCount, discountPrice } = formData;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getRooms());
      dispatch(reset());
      navigate("/rooms");
    }
  }, [isSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !roomNumbers) return;

    const roomArray = roomNumbers.split(",").map((item) => ({
      number: parseInt(item.trim()),
      unavailableDates: [],
    }));

    const list = await Promise.all(
      Object.values(files).map(async (file) => {
        const url = await uploadImage(file);
        return url;
      })
    );

    const dataToSubmit = {
      name,
      price,
      desc,
      roomCount,
      discountPrice,
      roomNumbers: roomArray,
      img: list,
    };

    dispatch(createRoom(dataToSubmit))
      .unwrap()
      .then(() => console.log("Room created"))
      .catch((err) => console.error("Create room failed:", err));
  };

  return (
    <div className="create-room-container">
      <Helmet>
        <title>Create Room</title>
      </Helmet>
      <div className="form-card">
        <h1>Create New Room</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Room Name</label>
            <input type="text" name="name" value={name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Price (LKR)</label>
            <input type="number" name="price" value={price} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Discount Price (LKR)</label>
            <input type="number" name="discountPrice" value={discountPrice} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea name="desc" value={desc} onChange={handleChange}></textarea>
          </div>

          <div className="input-group">
            <label>Total Rooms Available</label>
            <input type="number" name="roomCount" value={roomCount} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Room Numbers (comma-separated)</label>
            <textarea name="roomNumbers" value={roomNumbers} onChange={handleChange}></textarea>
          </div>

          <div className="input-group">
            <label>Room Images</label>
            <input type="file" name="file" multiple onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn">Create Room</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
