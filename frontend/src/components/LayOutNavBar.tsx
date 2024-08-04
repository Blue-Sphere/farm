import "./LayOutNavBar.css";

interface LayOutNavBarProps {
  items: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const LayOutNavBar = ({ items, currentIndex, onSelect }: LayOutNavBarProps) => {
  return (
    <div className="navbar-layout">
      {items.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${currentIndex === index ? "active" : ""}`}
          onClick={() => onSelect(index)}
        >
          {item}
        </div>
      ))}
      <div
        className="underline"
        style={{
          transform: `translateX(${currentIndex * 100}%)`,
          width: `${100 / items.length}%`,
        }}
      />
    </div>
  );
};

export default LayOutNavBar;
