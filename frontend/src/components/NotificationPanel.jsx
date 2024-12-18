import React, { useState } from "react";

function NotificationPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("unread");

  // Dummy Notifications for Different Tabs
  const notifications = {
    unread: [
      {
        id: 1,
        user: "Paul Svensson",
        action: "invited you to",
        target: "Prototyping",
        time: "Today • 23m ago",
        buttons: ["Join", "Decline"]
      },
      {
        id: 2,
        user: "Adam Nolan",
        action: "mentioned you in",
        target: "UX Basics",
        time: "Yesterday",
        buttons: ["Reply now"]
      }
    ],
    following: [
      {
        id: 3,
        user: "Anna Miller",
        action: "uploaded a",
        target: "Sketch file",
        time: "Yesterday",
        description: "social media cover templates"
      }
    ],
    archive: [
      {
        id: 4,
        user: "Robert Babírski",
        action: "said nothing important",
        time: "23 May 2024"
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md font-anta">
      {/* Notification Panel */}
      <div className="bg-[#262C3A] text-white rounded-2xl shadow-lg w-[500px] h-[600px] relative overflow-hidden font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        {/* Header */}
        <div className="border-b border-gray-700 p-4 font-anta">
          <h2 className="text-lg font-bold font-tektur">Notifications</h2>
          <div className="flex space-x-6 mt-2 text-sm">
            <span
              className={`cursor-pointer pb-1 ${activeTab === "unread"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"}`}
              onClick={() => setActiveTab("unread")}
            >
              Unread {notifications.unread.length}
            </span>
            <span
              className={`cursor-pointer pb-1 ${activeTab === "following"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"}`}
              onClick={() => setActiveTab("following")}
            >
              Following {notifications.following.length}
            </span>
            <span
              className={`cursor-pointer pb-1 ${activeTab === "archive"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"}`}
              onClick={() => setActiveTab("archive")}
            >
              Archive {notifications.archive.length}
            </span>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto font-anta">
          {notifications[activeTab].map(item =>
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#30343F] p-3 rounded-lg"
            >
              <div>
                <p className="text-sm">
                  <span className="font-bold">{item.user}</span> {item.action}{" "}
                  {item.target &&
                    <span className="font-semibold text-blue-400">
                      {item.target}
                    </span>}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.time}
                </p>
                {item.description &&
                  <span className="text-gray-500 text-xs">
                    {item.description}
                  </span>}
              </div>
              {item.buttons &&
                <div className="flex gap-2">
                  {item.buttons.map(btn =>
                    <button
                      key={btn}
                      className={`${btn === "Join"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-700 hover:bg-gray-600"} text-white text-xs px-3 py-1 rounded-lg`}
                    >
                      {btn}
                    </button>
                  )}
                </div>}
            </div>
          )}
          {notifications[activeTab].length === 0 &&
            <p className="text-gray-500 text-center text-sm">
              No notifications in this tab.
            </p>}
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;
