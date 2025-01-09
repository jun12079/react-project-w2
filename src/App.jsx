import { useState } from "react"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {

	const [isAuth, setIsAuth] = useState(false);
	const [tempProduct, setTempProduct] = useState({});
	const [products, setProducts] = useState([]);
	const [account, setAccount] = useState({
		username: "example@test.com",
		password: "example"
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setAccount({
			...account,
			[name]: value
		})
	}

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
			// console.log(res);
			const { token, expired } = res.data;

			document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
			setIsAuth(true);
			axios.defaults.headers.common['Authorization'] = token;
			getProducts();
		} catch (err) {
			// console.error(err);
			alert("登入失敗");
		}
	}

	const getProducts = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
			setProducts(res.data.products);
		} catch (err) {
			// console.error(err);
			alert("取得產品列表失敗");
		}
	}

	const checkUserLogin = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/v2/api/user/check`);
			alert("已登入");
		} catch (err) {
			// console.error(err);
			alert("未登入");
		}
	}

	return (
		<>
			{isAuth ?
				<div className="container">
					<div className="row mt-5">
						<div className="col-6">
							<button onClick={checkUserLogin} type="button" className="btn btn-success">檢查登入</button>
							<h2>產品列表</h2>
							<table className="table table-striped">
								<thead>
									<tr>
										<th scope="col">產品名稱</th>
										<th scope="col">原價</th>
										<th scope="col">售價</th>
										<th scope="col">是否啟用</th>
										<th scope="col">查看細節</th>
									</tr>
								</thead>
								<tbody>
									{products.map((item) => (
										<tr key={item.id} className="align-middle">
											<td>{item.title}</td>
											<td>{item.origin_price}</td>
											<td>{item.price}</td>
											<td>{item.is_enabled}</td>
											<td>
												<button className="btn btn-primary" onClick={() => { setTempProduct(item) }}>查看細節</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="col-6">
							<h2>單一產品細節</h2>
							{tempProduct.title ? (
								<div className="card mb-3">
									<img src={tempProduct.imageUrl} className="card-img-top primary-image" alt={tempProduct.title} />
									<div className="card-body">
										<h5 className="card-title">
											{tempProduct.title}
											<span className="badge bg-primary ms-2">{tempProduct.category}</span>
										</h5>
										<p className="card-text">商品描述：{tempProduct.description}</p>
										<p className="card-text">商品內容：{tempProduct.content}</p>
										<div className="d-flex">
											<p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
											元 / {tempProduct.price} 元
										</div>
										<h5 className="mt-3">更多圖片：</h5>
										<div className="row">
											{tempProduct.imagesUrl.map((image, index) => {
												return (
													<div className="col" key={index}>
														<img className="img-fluid" src={image} key={index} />
													</div>
												)
											})}
										</div>
									</div>
								</div>
							) : (
								<p className="text-secondary">請選擇一個商品查看</p>
							)}
						</div>
					</div>
				</div>
				:
				<div className="container">
					<div className="row justify-content-center mt-5">
						<div className="col-6">
							<div className="card">
								<div className="card-body">
									<form onSubmit={handleLogin}>
										<div className="mb-3">
											<label htmlFor="username" className="form-label">Username</label>
											<input type="email" className="form-control" id="username" name="username" value={account.username} onChange={handleInputChange} />
										</div>
										<div className="mb-3">
											<label htmlFor="password" className="form-label">Password</label>
											<input type="password" className="form-control" id="password" name="password" value={account.password} onChange={handleInputChange} />
										</div>
										<button id="login" type="submit" className="btn btn-primary">登入</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>}
		</>
	)
}

export default App
