import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./BillDate.css"
const Invoice = () => {
  return (
    <div className="bill_container">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="invoice-title">
                <h4 className="float-end font-size-15">
                  Invoice #DS0204 <span className="badge bg-success font-size-12 ms-2">Paid</span>
                </h4>
                <div className="mb-4">
                  <h2 className="mb-1 text-muted">BadmintonHub</h2>
                </div>
                <div className="text-muted">
                  <h5 className="font-size-16 mb-1">Trần Viết Hoàng</h5>
                  <p className="mb-1">
                    <i className="uil uil-envelope-alt me-1"></i>abc@gmail.com
                  </p>
                  <p>
                    <i className="uil uil-phone me-1"></i>0345678910
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row">
                <div className="col-sm-6">
                  <div className="text-muted">
                    <h5 className="font-size-16 mb-3">Thông Tin Sân:</h5>
                    <h5 className="font-size-15 mb-2">Sân cầu lông Bình Triệu</h5>
                    <p className="mb-1">Số 8 Đường 20, Khu phố 4, Phường Hiệp Bình Chánh, TP. Thủ Đức</p>
                    {/* <p className="mb-1">PrestonMiller@armyspy.com</p> */}
                    <p>001-234-5678</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted text-sm-end">
                    <div>
                      <h5 className="font-size-15 mb-1">Invoice No:</h5>
                      <p>#DZ0112</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-size-15 mb-1">Invoice Date:</h5>
                      <p>12 Oct, 2020</p>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-size-15 mb-1">Order No:</h5>
                      <p>#1123456</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <h5 className="font-size-15">Order Summary</h5>

                <div className="table-responsive">
                  <table className="table align-middle table-nowrap table-centered mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: '70px' }}>No.</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th className="text-end" style={{ width: '120px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">01</th>
                        <td>
                          <div>
                            <h5 className="text-truncate font-size-14 mb-1">Sân 1</h5>
                            <p className="text-muted mb-0">Watch, Black</p>
                          </div>
                        </td>
                        <td>$ 245.50</td>
                        <td className="text-end">$ 245.50</td>
                      </tr>
                      <tr>
                        <th scope="row">02</th>
                        <td>
                          <div>
                            <h5 className="text-truncate font-size-14 mb-1">Sân 2</h5>
                            <p className="text-muted mb-0">Watch, Gold</p>
                          </div>
                        </td>
                        <td>$ 245.50</td>
                        <td className="text-end">$491.00</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="text-end">Sub Total</th>
                        <td className="text-end">$732.50</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">Discount :</th>
                        <td className="border-0 text-end">- $25.50</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">Shipping Charge :</th>
                        <td className="border-0 text-end">$20.00</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">Tax</th>
                        <td className="border-0 text-end">$12.00</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">Total</th>
                        <td className="border-0 text-end"><h4 className="m-0 fw-semibold">$739.00</h4></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <a href="javascript:window.print()" className="btn btn-success me-1"><i className="fa fa-print"></i></a>
                    <a href="#" className="btn btn-primary w-md">Send</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
