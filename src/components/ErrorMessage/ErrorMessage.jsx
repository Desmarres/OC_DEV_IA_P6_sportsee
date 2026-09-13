import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ error }) {
    return (
        <div className={`${styles.pageContainer} heading-2`}>
            <h2 className="heading-2">{error.name} {error.status}</h2>
            <p className="body-default">{error.message}</p>
        </div>
    );

};