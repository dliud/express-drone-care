import { InboxOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

export function DragAndDrop({
    setIsFileUploaded,
    setPrescription,
    setTests,
    setPatientName,
    setDeliveryAddress,
    setLaunchAddress,
    setDeliveryInfo,
    setLaunchInfo
} : any) {
    const endpoint = 'http://localhost:3001/upload'

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        action: endpoint,
        onChange(info) {
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                let data = info.file.response;
                setIsFileUploaded(true)
                setPrescription(data.prescriptions);
                setTests(data.tests);
                setPatientName(data.patientName);
                setDeliveryAddress(data.deliveryAddress);
                setLaunchAddress(data.launchAddress);
                setLaunchInfo(data.launchInfo);
                setDeliveryInfo(data.deliveryInfo)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
      
    return (
        <Dragger {...props} style={{'padding': 40}}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">
                Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
                The file should be in PDF form.
            </p>
        </Dragger>
    )
}