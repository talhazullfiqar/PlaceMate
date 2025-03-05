import "./UsersList.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
export default function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <>
        <div className="center">
          <Card>
            <h2>User not found</h2>
          </Card>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="center">
        <ul className="users-list">
          {props.items.map((user) => {
            return (
              <UserItem
                key={user.id}
                id={user.id}
                image={user.image}
                name={user.name}
                placeCount={user.places}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}
