import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

class CartAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selectedPhoto: null,
      selectedTitle: '',
      selectedQuantity: 1,
      selectedUnit: '',
      products: [],
    };
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.startCamera();
  }

  componentWillUnmount() {
    this.stopCamera();
  }

  startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.setState({ cameraStream: stream });
      if (this.videoRef.current) {
        this.videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  stopCamera = () => {
    if (this.state.cameraStream) {
      const tracks = this.state.cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  handleTitleChange = (event) => {
    this.setState({ selectedTitle: event.target.value });
  };

  handlePhotoCapture = () => {
    const { photos } = this.state;
    if (photos.length >= 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    const video = this.videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      this.setState((prevState) => ({
        photos: [...prevState.photos, blob],
      }));
    }, 'image/jpeg');
  };

  handlePhotoSelection = (photo) => {
    this.setState({ selectedPhoto: photo });
  };

  handleQuantityDecrement = () => {
    const { selectedQuantity } = this.state;
    if (selectedQuantity > 1) {
      this.setState({ selectedQuantity: selectedQuantity - 1 });
    }
  };

  handleQuantityIncrement = () => {
    const { selectedQuantity } = this.state;
    this.setState({ selectedQuantity: selectedQuantity + 1 });
  };

  handleUnitChange = (event) => {
    this.setState({ selectedUnit: event.target.value });
  };

  handleProductAdd = () => {
    const { selectedPhoto, selectedTitle, selectedQuantity, selectedUnit, products } = this.state;
    if (!selectedPhoto) {
      alert('Please select a photo');
      return;
    }
    if (!selectedTitle) {
      alert('Please add a title');
      return;
    }

    const newProduct = {
      photo: selectedPhoto,
      title: selectedTitle,
      quantity: selectedQuantity,
      unit: selectedUnit,
    };

    this.setState((prevState) => ({
      products: [...prevState.products, newProduct],
      selectedPhoto: null,
      selectedTitle: '',
      selectedQuantity: 1,
      selectedUnit: '',
    }));
  };

  handleProductDelete = (product) => {
    const { products } = this.state;
    const updatedProducts = products.filter((p) => p !== product);
    this.setState({ products: updatedProducts });
  };

  handlePhotoDelete = (photo) => {
    const { photos } = this.state;
    const updatedPhotos = photos.filter((p) => p !== photo);
    this.setState({ photos: updatedPhotos });
  };

  render() {
    const { photos, selectedPhoto, selectedTitle, selectedQuantity, selectedUnit, products } = this.state;

    return (
      <div>
        <h2>Cart Admin</h2>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1' }}>
            <form>
              <video
                ref={this.videoRef}
                autoPlay
                muted
                style={{ width: '300px', height: '225px' }}
              />
              <br />
              <button type="button" onClick={this.handlePhotoCapture}>
                Capture Photo
              </button>
            </form>
            <br />
            <div>
              {photos.length > 0 && (
                <div>
                  <h3>Photos:</h3>
                  {photos.map((photo, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index}`}
                        style={{ width: '100px', height: 'auto' }}
                        onClick={() => this.handlePhotoSelection(photo)}
                      />
                      <button onClick={() => this.handlePhotoDelete(photo)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: '1', marginLeft: '20px' }}>
            {selectedPhoto && (
              <div>
                <h3>Selected Photo:</h3>
                <img
                  src={URL.createObjectURL(selectedPhoto)}
                  alt="Selected"
                  style={{ width: '300px', height: '225px' }}
                />
                <br />
                <label>
                  Title:
                  <input
                    type="text"
                    value={selectedTitle}
                    onChange={this.handleTitleChange}
                  />
                </label>
                <br />
                <label>
                  Quantity:
                  <div>
                    <button onClick={this.handleQuantityDecrement}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{selectedQuantity}</span>
                    <button onClick={this.handleQuantityIncrement}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </label>
                <br />
                <label>
                  Unit:
                  <select value={selectedUnit} onChange={this.handleUnitChange}>
                    <option value="">Empty</option>
                    <option value="gm">gm</option>
                    <option value="kg">kg</option>
                  </select>
                </label>
                <br />
                <button type="button" onClick={this.handleProductAdd}>
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          {products.length > 0 && (
            <div>
              <h3>Product Catalogue:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={URL.createObjectURL(product.photo)}
                          alt={`Product ${index + 1}`}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </td>
                      <td>{product.title}</td>
                      <td>{product.quantity}</td>
                      <td>{product.unit}</td>
                      <td>
                        <button onClick={() => this.handleProductDelete(product)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CartAdmin;
