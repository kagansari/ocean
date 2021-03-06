import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_URL } from "../API";

const VesselUpload = () => {
  const handleChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Upload
      name={"file"}
      action={`${API_URL}/ProcessAIS`}
      onChange={handleChange}
      className={"w-100p"}
    >
      <Button icon={<UploadOutlined />} className={"w-100p"}>Click to Upload</Button>
    </Upload>
  );
};

export default VesselUpload;
