import React, { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { useNavigate, useParams } from "react-router-dom";
import { getOneBook } from "../../api/book";
import jwtDecode from "jwt-decode";
import { addToCart } from "../../api/cart";
import { toast } from "react-toastify";
import { Ibook } from "../../interface/Ibook";
import { Tabs, Tab } from "@mui/material";
import TabPanel from "../../components/Tab-panel/Tabpanel";
import { useForm } from "react-hook-form";
import { Icomment } from "../../interface/Icomment";
import { addComment, getCommentByProductId } from "../../api/comment";
import StarList from "../../components/Star/StarList";
import IconCheck from "../../components/Icon/IconCheck";
import { getAllUsers } from "../../api/user";
import "../../asset/css/ProductDetail.css";
interface DecodedToken {
  _id: string;
}
const ProductDetail = () => {
  const [book, setBook] = useState<any>({});
  const [quantity, setQuantity] = useState<number>(1);
  const { register, handleSubmit } = useForm();
  const [coment, setComent] = useState([]);
  const [quantityComment, setQuantityComment] = useState(0);
  const [value, setValue] = useState(0);
  const [renderPage, setRenderPage] = useState(false);
  const [user, setUser] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const handleChange = (_event: any, newValue: any) => {
    setValue(newValue);
  };
  useEffect(() => {
    getOneBook(id).then(({ data }) => {
      const book = data.product;
      setBook(book);
    });
  }, [id, renderPage]);
  useEffect(() => {
    getCommentByProductId(id).then(({ data }) => {
      setQuantityComment(data.commentCount);
      setComent(data.comments);
    });
  }, [renderPage]);
  useEffect(() => {
    getAllUsers().then(({ data }) => {
      setUser(data.data);
    });
  }, []);
  const getNameUser = (userId: string) => {
    const nameUser: any = user.find((item: any) => item._id === userId);
    return nameUser ? nameUser.name : "No user";
  };
  const getCurrentUserId = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token) as DecodedToken;
      const userId = decodedToken._id;
      return userId;
    }
    return null;
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value);
  };
  const addCart = async (product: Ibook) => {
    try {
      const userId = getCurrentUserId();
      await addToCart(product, userId, quantity);
      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      ("/cart");
      navigate("/cart");
    } catch (error) {
      toast.error("Bạn cần đăng nhập");
    }
  };
  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const comment = async (comment: Icomment) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("Bạn cần đăng nhập");
        return;
      }
      const commentData = {
        userId: userId,
        productId: book._id,
        text: comment.text,
      };
      await addComment(commentData);
      setRenderPage(true);
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };
  const handelSubmitComment = (data: any) => {
    comment(data);
  };
  return (
    <div>
      <Banner>Product Detail</Banner>
      <section className="detail-book">
        <div className="detail-book-elem">
          <div className="bread-crumnb">
            <span>Home</span>
            <span>&gt;</span>
            <span>Product</span>
            <span>&gt;</span>
            <span>Product-Detail</span>
            <span>&gt;</span>
            <span>{book.name}</span>
          </div>
          <div className="detail-book-elem-top">
            <div className="detail-book-elem-image">
              <img src={book.image} alt="" />
            </div>
            <div className="detail-book-elem-content">
              <h1 className="product-name">{book.name}</h1>
              <span className="product-price">${book.price}</span>
              <p className="description-short">{book.description}</p>
              <div className="qty">
                <span>Quantity:</span>
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="add-to-cart">
                <span className="material-icons">add_shopping_cart</span>
                <button onClick={() => addCart(book)}>ADD TO CART</button>
              </div>
              <span className="in-stock">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                In stock
              </span>
              <div className="category">
                <span>Category:</span>
                <a href="">Rachael Lippincott</a>
              </div>
            </div>
          </div>
          <div className="detail-book-elem-bottom">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Description"
                sx={{
                  color: value === 0 ? "#1cc0a0" : "#1cc0a0",
                }}
                {...a11yProps(0)}
              />
              <Tab
                label="Comment"
                sx={{
                  color: value === 1 ? "#1cc0a0" : "#1cc0a0",
                }}
                {...a11yProps(1)}
              />
              <Tab
                label="List Comment"
                sx={{
                  color: value === 2 ? "#1cc0a0" : "#1cc0a0",
                }}
                {...a11yProps(2)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="detail-book-elem-bottom-box">
                <h3>Product Information</h3>
                <p>{book.description}</p>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="comment-wrraper bg-[#F8F8F8]">
                <form
                  className="comment px-[50px] py-[20px]"
                  onSubmit={handleSubmit(handelSubmitComment)}
                >
                  <div className="flex gap-8">
                    <div className="text-center leading-8">
                      <h2 className="text-[#1cc0a0] text-[18px] font-bold">
                        Comment
                      </h2>
                      <p className="text-[18px">5/5</p>
                      <div className="">
                        <StarList></StarList>
                      </div>
                      <span className="text-[12px]">
                        ({quantityComment} comment)
                      </span>
                      <button className="bg-[#1cc0a0] text-white px-5 text-[12px]">
                        Submit
                      </button>
                    </div>
                    <div className="w-[100%]">
                      <textarea
                        id=""
                        className="w-[100%] outline-none p-5 h-[100%]"
                        placeholder="Write your review here ....."
                        {...register("text")}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              {coment.length === 0 ? (
                <div className="text-center">
                  <p className="text-[14px]">There are no comments.</p>
                </div>
              ) : (
                <div className="">
                  {coment.map((item: Icomment) => {
                    {
                      return (
                        <div
                          className="max-w-full px-[50px] py-[20px] bg-[#f8f8f8] m-3 mb-3"
                          key={item._id}
                        >
                          <div className="flex items-centers justify-start gap-3">
                            <span>{getNameUser(item.userId)}</span>
                            <StarList></StarList>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconCheck></IconCheck>
                            <p className="text-[14px] text-[#1cc0a0] pt-[2px]">
                              Purchased at Molla - Read books every day
                            </p>
                          </div>
                          <div className="text-[14px] pt-[20px]">
                            <p>Content rated:</p>
                            <p>{item.text}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </TabPanel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
