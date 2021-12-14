import "./App.css";
import OrderBox, { Order } from "./components/OrderBox";

const dataList: Order[] = [
  {
    index: 1,
    name: "Product 1",
    imageURL:
      "https://ia800904.us.archive.org/27/items/pixabay-10737/thumbnail-10737.jpg",
    altText: "Photo of a evening sunset",
  },
  {
    index: 2,
    name: "Product 2",
    imageURL:
      "http://3.bp.blogspot.com/-z6IKma15Gfg/TkaVXcxO4DI/AAAAAAAAIow/sfvWI8N_yeI/s1600/shutterstock+royalty+free+stock+photos.jpg",
    altText: "Something like a pipeline",
  },
  {
    index: 3,
    name: "Product 3",
    imageURL:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2016/03/fall-trees-road-1.jpg",
    altText: "Among the woods",
  },
];

function App(): JSX.Element {
  return (
    <div className="flexyBox">
      <p>Order a Product!</p>
      {dataList.map((data) => (
        <OrderBox
          key={data.index}
          index={data.index}
          name={data.name}
          imageURL={data.imageURL}
          altText={data.altText}
        />
      ))}
    </div>
  );
}

export default App;
