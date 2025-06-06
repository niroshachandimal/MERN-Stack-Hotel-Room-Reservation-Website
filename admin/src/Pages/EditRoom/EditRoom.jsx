// src/pages/EditRoom.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateRoom, reset } from "../../features/room/roomSlice";
import { uploadImage } from "../../helper/utils";
import "./EditRoom.scss";
import { Helmet } from "react-helmet";

const EditRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();

  const [files, setFiles] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    desc: "",
    roomNumbers: "",
    roomCount: "",
    img: [],
  });

  const { name, price, discountPrice, desc, roomNumbers, roomCount } = formData;

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        const data = await res.json();

        const { roomNumbers, ...rest } = data;
        const roomMap = roomNumbers.map((item) => item.number);
        const roomString = roomMap.join(", ");

        setFormData({ ...rest, roomNumbers: roomString });
      } catch (err) {
        console.log(err);
      }
    };
    getRoom();
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/rooms");
    }
  }, [isSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !roomNumbers) return;

    const roomArray = roomNumbers.split(",").map((num) => ({
      number: parseInt(num.trim()),
      unavailableDates: [],
    }));

    let updatedImages = formData.img;
    if (files && files.length > 0) {
      updatedImages = await Promise.all(
        Array.from(files).map(async (file) => await uploadImage(file))
      );
    }

    const payload = {
      name,
      price,
      desc,
      roomCount,
      discountPrice,
      roomNumbers: roomArray,
      img: updatedImages,
      roomId: id,
    };

    dispatch(updateRoom(payload));
  };

  return (
    <div className="edit-room-page">
      <Helmet>
        <title>Edit Room</title>
      </Helmet>
      <div className="edit-room-card">
        <h2>Edit Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="form-group">
              <input type="text" name="name" value={name} onChange={handleChange} required />
              <label>Room Name</label>
            </div>

            <div className="form-group">
              <input type="number" name="price" value={price} onChange={handleChange} required />
              <label>Price (LKR)</label>
            </div>

            <div className="form-group">
              <input type="number" name="discountPrice" value={discountPrice} onChange={handleChange} />
              <label>Discount Price</label>
            </div>

            <div className="form-group">
              <input type="number" name="roomCount" value={roomCount} onChange={handleChange} />
              <label>Room Count</label>
            </div>
          </div>

          <div className="form-group full">
            <textarea name="desc" value={desc} onChange={handleChange} rows="3" />
            <label>Description</label>
          </div>

          <div className="form-group full">
            <textarea
              name="roomNumbers"
              value={roomNumbers}
              onChange={handleChange}
              placeholder="101, 102, 103"
              rows="2"
            />
            <label>Room Numbers (comma-separated)</label>
          </div>

          <div className="form-group full">
            <label className="file-label">Upload Images (optional)</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn">Update Room</button>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
