import { useState, useEffect } from "react";
import {
  Panel,
  Form,
  Button,
  Input,
  SelectPicker,
  Avatar,
  Grid,
  Row,
  Col,
  Container,
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Edit } from "@rsuite/icons";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import CalendarDateHeader from "../components/CalendarDateHeader";
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from "../utils/supabase"; 

const ProfilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profile, setProfile] = useState({
    avatar_url: "",
    date_of_birth: "",
    gender: "",
    email: "",
    mobile_phone: "",
    street_address: "",
    zip: "",
    website: "",
    about_me: "",
    activities: "",
    hobbies: "",
    interests: "",
    entertainment: "",
    work_education: ""
  });

  const [uploading, setUploading] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  
  const handlePrevClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1))
    );
  };

  const handleNextClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("user_profiles") 
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          toast.error("Failed to load profile data");
        } else {
          setProfile(data || {}); 
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (value, field) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) handleUploadAvatar(file);
  };
   
  const handleUploadAvatar = async (file) => {
    setUploading(true);
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      toast.error("Failed to get user information");
      setUploading(false);
      return;
    }
  
    if (user && file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `user_avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast.error("Failed to upload avatar");
        setUploading(false);
        return;
      }

      const { data: publicURLData, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlError) {
        toast.error("Failed to retrieve avatar URL");
        setUploading(false);
        return;
      }

      const publicURL = publicURLData.publicUrl;

      const { error: saveError } = await supabase
        .from("user_profiles")
        .upsert({ user_id: user.id, avatar_url: publicURL }, { onConflict: ["user_id"] });

      if (saveError) {
        toast.error("Failed to save avatar URL");
      } else {
        setProfile((prev) => ({ ...prev, avatar_url: publicURL }));
        toast.success("Avatar updated successfully");
      }

      setUploading(false);
    } else {
      toast.error("No user or file detected for upload");
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profileData = {
        ...profile,
        activities: profile.activities ? profile.activities.split(",") : [],
        hobbies: profile.hobbies ? profile.hobbies.split(",") : [],
        interests: profile.interests ? profile.interests.split(",") : [],
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_profiles") 
        .upsert(profileData);

      if (error) {
        toast.error("Failed to save profile data");
      } else {
        toast.success("Profile updated successfully");
      }
    }
  };

  return (
    <>
      <TopBar toggleMenu={toggleMenu} />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <CalendarDateHeader
        currentDate={currentDate}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
      <ToastContainer />

      <div className="flex flex-row items-center justify-center w-full mt-35">
        <Container className="max-w-4xl mx-auto p-6 space-y-6">
          <Panel header="Profile Card" bordered>
            <Form fluid>
              <Grid fluid>
                <Row className="mb-4">
                    <Col xs={24} md={6} className="relative">
                <div
                  className="relative w-24 h-24 cursor-pointer mx-auto"
                  onClick={() => document.getElementById("avatar-upload").click()}
                  style={{ position: "relative", display: "inline-block" , borderRadius: "50%",
                    overflow: "hidden",}}
                >
                  <Avatar
                    src={profile.avatar_url || "/path/to/default-avatar.jpg"}
                    alt="avatar"
                    size="xxl"
                    circle
                    className="w-full h-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white opacity-50 flex justify-center items-center">
                      <span>...</span>
                    </div>
                  )}
                  {!uploading && (
                    <Edit
                      className="absolute inset-0 text-gray-700 opacity-0 hover:opacity-100"
                      style={{
                        fontSize: "24px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Col>
                  <Col xs={24} md={18}>
                    <Row>
                      <Col xs={24} md={12} className="p-2">
                        <Form.Group>
                          <Form.ControlLabel>Date of Birth</Form.ControlLabel>
                          <Input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(value) => handleChange(value, "date_of_birth")}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={24} md={12} className="p-2">
                        <Form.Group>
                          <Form.ControlLabel>Gender</Form.ControlLabel>
                          <SelectPicker
                            value={profile.gender}
                            onChange={(value) => handleChange(value, "gender")}
                            data={[
                              { label: "Male", value: "male" },
                              { label: "Female", value: "female" },
                              { label: "Other", value: "other" },
                              { label: "Prefer not to say", value: "undisclosed" },
                            ]}
                            block
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Panel>

          <Panel header="Contact Information" bordered>
            <Form fluid>
              <Grid fluid>
                <Row>
                  <Col xs={24} md={12} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Email</Form.ControlLabel>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(value) => handleChange(value, "email")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} md={12} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Mobile Phone</Form.ControlLabel>
                      <Input
                        type="tel"
                        value={profile.mobile_phone}
                        onChange={(value) => handleChange(value, "mobile_phone")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} md={12} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Street Address</Form.ControlLabel>
                      <Input
                        value={profile.street_address}
                        onChange={(value) => handleChange(value, "street_address")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} md={12} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>ZIP</Form.ControlLabel>
                      <Input
                        value={profile.zip}
                        onChange={(value) => handleChange(value, "zip")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} md={12} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Website</Form.ControlLabel>
                      <Input
                        type="url"
                        value={profile.website}
                        onChange={(value) => handleChange(value, "website")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Panel>

          <Panel header="Personal Information" bordered>
            <Form fluid>
              <Grid fluid>
                <Row>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>About Me</Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={4}
                        value={profile.about_me}
                        onChange={(value) => handleChange(value, "about_me")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Activities</Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={3}
                        value={profile.activities}
                        onChange={(value) => handleChange(value, "activities")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Hobbies</Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={3}
                        value={profile.hobbies}
                        onChange={(value) => handleChange(value, "hobbies")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>Interests</Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={3}
                        value={profile.interests}
                        onChange={(value) => handleChange(value, "interests")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>
                        Movies, Music, TV, etc.
                      </Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={3}
                        value={profile.entertainment}
                        onChange={(value) => handleChange(value, "entertainment")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Panel>

          <Panel header="Work & Education" bordered>
            <Form fluid>
              <Grid fluid>
                <Row>
                  <Col xs={24} className="p-2">
                    <Form.Group>
                      <Form.ControlLabel>
                        Work & Education History
                      </Form.ControlLabel>
                      <Input
                        as="textarea"
                        rows={6}
                        value={profile.work_education}
                        onChange={(value) => handleChange(value, "work_education")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Grid>
            </Form>
          </Panel>

          <div className="flex justify-end mt-4">
            <Button appearance="primary" size="lg" onClick={saveProfile}>
              Save Changes
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProfilePage;