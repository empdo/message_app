import React from "react";
import contentManager from "../../contentmanager";
import "./profile.scss";
import Resizer from "react-image-file-resizer";

const Profile = () => {
    let [profilePicture, setProfilePic] = React.useState<Blob | undefined>();

    const useProfilePicture = () => {
        const [imageSrc, setPreview] = React.useState<string | undefined>()

        React.useEffect(() => {
            if (!profilePicture) {
                setPreview(undefined)
                return
            }

            const objectUrl = URL.createObjectURL(profilePicture);
            setPreview(objectUrl)
                
            return () => URL.revokeObjectURL(objectUrl);

        }, [profilePicture])

        return {imageSrc, setProfilePic};
    }

    const upploadImage = (e:  React.FormEvent<HTMLFormElement>) => {

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
            (uri) => {
                if(uri) {
                    contentManager.sendBlob(uri as Blob);
                }
            },
            "base64",
            64,
            64,
          );

    }
    
     const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
            setProfilePic(undefined);
            return;
        }

        setProfilePic(e.currentTarget.files[0])
    }

/*     const {imageSrc, setProfilePic} = useProfilePicture();  */

    return (

        <div id="profile">
            <div>
{/*                 <img src={imageSrc} alt="" /> */}
                <h2>{contentManager.user?.name}</h2>
                <p># {contentManager.user?.id}</p>
            </div>
            
            <form onSubmit={(e) => upploadImage(e)}> 
                <input type='file' accept="image/*" onChange={(e) => fileChange(e)} />
                <button type="submit">set profile picture</button>
            </form>

        </div>
    )
}

export default Profile;