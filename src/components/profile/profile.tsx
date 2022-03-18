import React from "react";
import contentManager from "../../contentmanager";
import "./profile.scss";
import Resizer from "react-image-file-resizer";
import { User } from "../../interfaces";

export const useUser = () => {
  const [user, setUser] = React.useState<User | undefined>(contentManager.user);

  React.useEffect(() => {
    const messageCallback = () => {
      let shallow = Object.assign({}, contentManager.user);
      setUser(shallow);
    };

    contentManager.addListener("user", messageCallback);

    return () => {
      contentManager.removeListener("user", messageCallback);
    };
  }, [user]);

  return user;
};

const Profile = () => {
  let [profilePicture, setProfilePic] = React.useState<Blob | undefined>();

  const upploadImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profilePicture) {
      return;
    }

    Resizer.imageFileResizer(
      profilePicture,
      64,
      64,
      "PNG",
      100,
      0,
      async (uri) => {
        if (uri) {
          await contentManager.sendBlob(uri as Blob);
        }
      },
      "base64",
      64,
      64
    );
  };

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      setProfilePic(undefined);
      return;
    }

    setProfilePic(e.currentTarget.files[0]);
  };

  const user = useUser();
  const url = `https://messageapi.essung.dev/static/`;

  return (
    <div id="profile">
      {user && (
        <div>
          {user.picture ? <img alt=" " src={url + user.picture} /> : <></>}
          <h2>{user.name}</h2>
          <p>{user && "#" + user?.id}</p>
        </div>
      )}

      <form onSubmit={(e) => upploadImage(e)}>
        <input type="file" accept="image/*" onChange={(e) => fileChange(e)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
