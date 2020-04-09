import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sku from "../Sku";
import * as api from "../../api";
import { setRecommend } from "../../actions";

function Recommend(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const recommend = useSelector(state => state.recommend);

  useEffect(() => {
    api
      .getRecommend((user && user.gender) || "")
      .then(res => {
        dispatch(setRecommend(res.data));
      })
      .catch(err => {});
  }, []);

  return (
    <div className="recommend-wrapper">
      <h4 className="title">猜你喜欢</h4>
      <div className="recommend">
        {recommend && recommend.length
          ? recommend.map(product => (
              <Sku product={product} key={product.id} {...props} />
            ))
          : ""}
      </div>
    </div>
  );
}

export default React.memo(Recommend);
