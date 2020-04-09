import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import formatDate from "../../utils/formatDate";
import { message } from "antd";
import { setOrders } from "../../actions";

function Evaluation(props) {
  const [state, setState] = useState({
    evaluation: null,
    tab: "detail",
    content: "",
    unEvaluated: null,
    isFetching: false
  });

  const { evaluation, tab, content, unEvaluated } = state;
  const orders = useSelector(state => state.orders);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = parseInt(props.match.params.id);
    //获取商品评论
    api
      .getEvaluation(id)
      .then(res => {
        setState({
          ...state,
          evaluation: res.data.sort((prev, next) => next.id - prev.id)
        });
      })
      .catch(() => {});
    if (!user) {
      return;
    }
    //获取用户订单
    if (orders) {
      const unEvaluated = canEvaluate(id);
      setState({
        ...state,
        unEvaluated
      });
    } else {
      api
        .getOrders()
        .then(res => {
          dispatch(setOrders(res.data));
          const unEvaluated = canEvaluate(id);
          setState({
            ...state,
            unEvaluated
          });
        })
        .catch(() => {});
    }
  }, []);

  function canEvaluate(id) {
    return orders.find(
      order => order.status === "toEvaluate" && order.product.id === id
    );
  }

  function handleClickTab(curTab) {
    if (tab !== curTab) {
      setState({ ...state, tab: curTab });
    }
  }

  function handleTextarea(e) {
    setState({
      ...state,
      content: e.target.value
    });
  }

  function handleSubmit() {
    const { content, unEvaluated, isFetching } = state;
    if (isFetching) {
      return;
    }
    if (!content) {
      message.info("评论内容不能为空", 2);
      return;
    }
    setState({
      ...state,
      isFetching: true
    });
    api
      .createEvaluation({
        pid: unEvaluated.product.id,
        oid: unEvaluated.id,
        username: user.username,
        nickyname: user.nickyname || "",
        content
      })
      .then(res => {
        setState({
          ...state,
          isFetching: false,
          evaluation: res.data.sort((prev, next) => next.id - prev.id),
          unEvaluated: null
        });
      })
      .then(() => {
        return api.getOrders();
      })
      .then(res => {
        setOrders(res.data);
      })
      .catch(() => {
        setState({
          ...state,
          isFetching: false
        });
      });
  }

  const { product } = props;
  return (
    <div className="detail-container">
      <ul
        className={`navbar ${tab === "detail" ? "active" : ""}`}
        style={{ marginBottom: 0 }}
      >
        <li
          onClick={() => handleClickTab("detail")}
          className={tab === "detail" ? "active" : ""}
        >
          商品详情
        </li>
        <li
          onClick={() => handleClickTab("evaluation")}
          className={tab === "evaluation" ? "active" : ""}
        >
          累计评价
          <span className="number">{evaluation && evaluation.length}</span>
        </li>
      </ul>
      <div className="content-area">
        {tab === "detail" ? (
          <div className="detail">
            {product &&
              product.detail.split("\n").map((item, index) => (
                <p className="detail-item" key={index}>
                  {item}
                </p>
              ))}
          </div>
        ) : (
          <div className="evaluation">
            {unEvaluated ? (
              <div className="add-evaluation">
                <h2>其他买家，需要你的建议哦！</h2>
                <div className="textarea-wrapper">
                  <textarea value={content} onChange={handleTextarea} />
                  <span className="tips">
                    <span>{content.length}</span> / 300
                  </span>
                </div>
                <div className="action">
                  <div className="btn" role="button" onClick={handleSubmit}>
                    提交评价
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <ul className="content">
              {evaluation && evaluation.length ? (
                evaluation.map(item => (
                  <li className="comment" key={item.id}>
                    <div className="user">
                      <div className="avatar">
                        <img
                          src={require("../../style/img/avatar.png")}
                          alt="avatar"
                        />
                      </div>
                      <span className="username">
                        {item.nickyname || item.username}
                      </span>
                      <span className="time">{formatDate(item.createdAt)}</span>
                    </div>
                    <p className="evaluation-content">{item.content}</p>
                  </li>
                ))
              ) : (
                <li>
                  <span>该商品还没有评论</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Evaluation;
