import React, { Component } from 'react';



class Modal extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }




  render() {
      return(
        <div>
          <div className="modal fade show" id="userModal" tabIndex="-1" role="dialog" aria-labelledby="userModal" aria-hidden="false" style={{display: 'block'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">{this.props.title}</h4>
                  <button onClick={this.props.close} type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>

                <div className="modal-body p-0">

                  <div className="modal-body-scroller">
                    {this.props.body}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )
  }
}


export default Modal;
