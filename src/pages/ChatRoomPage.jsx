// import { useState, useEffect } from "react";
// import {
//   Panel,
//   Form,
//   Button,
//   Input,
//   Row,
//   Col,
//   Container,
//   Avatar,
//   Loader
// } from "rsuite";
// // import "rsuite/dist/rsuite.min.css";
// import { supabase } from "../utils/supabase"; // Import your Supabase client

// import TopBar from "../components/TopBar";
// import Menu from "../components/Menu";
// import { ToastContainer, toast } from 'react-toastify';

// const ChatRoomPage = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   // Fetch messages on load and set up real-time listener
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .order("created_at", { ascending: true });
  
//       if (error) {
//         toast.error("Failed to load messages");
//       } else {
//         setMessages(data);
//       }
//       setLoading(false);
//     };
  
//     fetchMessages();
  
//     // Real-time listener for new messages
//     const channel = supabase
//       .channel("public:messages")
//       .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
//         setMessages((prevMessages) => [...prevMessages, payload.new]);
//       })
//       .subscribe();
  
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);
  

//   const sendMessage = async () => {
//     if (message.trim() === "") return;
  
//     // Get the current user's information
//     const {
//       data: { user },
//       error: userError
//     } = await supabase.auth.getUser();
  
//     if (userError) {
//       toast.error("Failed to get user information");
//       return;
//     }
  
//     const { error } = await supabase.from("messages").insert([
//       {
//         content: message,
//         user_id: user.id, // Use user.id instead of calling supabase.auth.user()
//         username: user.email || "Anonymous", // Use user.email for the username
//       },
//     ]);
  
//     if (error) {
//       toast.error("Failed to send message");
//     } else {
//       setMessage(""); // Clear the input after sending
//     }
//   };

//   return (
//     <>
//       <TopBar toggleMenu={toggleMenu} />
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-50">
//           <Menu toggleMenu={toggleMenu} />
//         </div>
//       )}
//       <ToastContainer />

//       <div className="flex flex-row items-center justify-center w-[70%] mx-auto mt-60">
//       <Container>
//           {/* Chat Room */}
//           <Panel header="Chat Room" bordered>
//             {loading ? (
//               <Loader content="Loading chat..." />
//             ) : (
//               <div style={{ maxHeight: "500px", overflowY: "auto" }}>
//                 {messages.map((msg) => (
//                   <Row key={msg.id} style={{ padding: "8px 0" }}>
//                     <Col xs={2}>
//                       <Avatar>{msg.username[0]}</Avatar>
//                     </Col>
//                     <Col xs={22}>
//                       <div>
//                         <strong>{msg.username}</strong>
//                         <p>{msg.content}</p>
//                         <span style={{ fontSize: "10px", color: "#aaa" }}>
//                           {new Date(msg.created_at).toLocaleString()}
//                         </span>
//                       </div>
//                     </Col>
//                   </Row>
//                 ))}
//               </div>
//             )}

//             {/* Message Input */}
//             <Form fluid>
//               <Row>
//                 <Col xs={20}>
//                   <Input
//                     placeholder="Type your message..."
//                     value={message}
//                     onChange={setMessage}
//                   />
//                 </Col>
//                 <Col xs={4}>
//                   <Button appearance="primary" onClick={sendMessage}>
//                     Send
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </Panel>
//         </Container>
       
//       </div>
//     </>
//   );
// };

// export default ChatRoomPage;

import { useState, useEffect } from "react";
import {
  Panel,
  Form,
  Button,
  Input,
  Row,
  Col,
  Container,
  Avatar,
  Loader
} from "rsuite";
import { supabase } from "../utils/supabase";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import { ToastContainer, toast } from 'react-toastify';

const ChatRoomPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");
  

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Fetch messages on load and set up real-time listener
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
  
      if (error) {
        toast.error("Failed to load messages");
      } else {
        setMessages(data);
      }
      setLoading(false);
    };
  
    fetchMessages();
  
    // Real-time listener for new messages
    const channel = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setLoggedInUserEmail(user.email); // Store the user's email for conditional styling
      } else {
        toast.error("Failed to get user information");
      }
    };

    fetchUser();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (message.trim() === "") return;
  
    // Get the current user's information
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
  
    if (userError) {
      toast.error("Failed to get user information");
      return;
    }
  
    const { error } = await supabase.from("messages").insert([
      {
        content: message,
        user_id: user.id,
        username: user.email || "Anonymous",
      },
    ]);
  
    if (error) {
      toast.error("Failed to send message");
    } else {
      setMessage(""); // Clear the input after sending
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
      <ToastContainer />

      <div className="flex flex-row items-center justify-center w-[70%] mx-auto mt-35">
        <Container>
          {/* Chat Room */}
          <Panel header="Chat Room" bordered>
            {loading ? (
              <Loader content="Loading chat..." />
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {messages.map((msg) => (
                  <Row
                    key={msg.id}
                    style={{
                      padding: "8px 0",
                      display: "flex",
                      justifyContent: msg.username === loggedInUserEmail ? "flex-end" : "flex-start"
                    }}
                  >
                    {msg.username !== loggedInUserEmail && (
                      <Col xs={2}>
                        <Avatar>{msg.username[0]}</Avatar>
                      </Col>
                    )}
                    <Col xs={20} style={{
                      backgroundColor: msg.username === loggedInUserEmail ? "#f7f1c14d" : "#ffffff",
                      padding: "8px",
                      borderRadius: "8px",
                      textAlign: msg.username === loggedInUserEmail ? "right" : "left",
                    }}>
                      <strong>{msg.username}</strong>
                      <p>{msg.content}</p>
                      <span style={{ fontSize: "10px", color: "#aaa" }}>
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </Col>
                    {msg.username === loggedInUserEmail && (
                      <Col xs={2}>
                        <Avatar>{msg.username[0]}</Avatar>
                      </Col>
                    )}
                  </Row>
                ))}
              </div>
            )}

            {/* Message Input */}
            <Form fluid>
              <Row>
                <Col xs={22}>
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={setMessage}
                  />
                </Col>
                <Col xs={1}>
                  <Button appearance="primary" onClick={sendMessage}>
                    Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Container>
      </div>
    </>
  );
};

export default ChatRoomPage;
