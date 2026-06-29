'use client'

import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import type { FilePondFile } from 'filepond'
import { cn } from '@/lib/utils'

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
)

interface FileUploadProps {
    onFilesChange: (files: File[]) => void
    maxFiles?: number
    maxFileSize?: string
    acceptedTypes?: string[]
    className?: string
    labelIdle?: string
    labelFileLoading?: string
    labelFileProcessing?: string
    labelFileProcessingComplete?: string
    labelFileProcessingError?: string
    labelTapToCancel?: string
    labelTapToRetry?: string
    labelTapToUndo?: string
    labelFileTypeNotAllowed?: string
    fileValidateTypeLabelExpectedTypes?: string
    labelMaxFileSizeExceeded?: string
    labelMaxFileSize?: string
    allowMultiple?: boolean
    allowReorder?: boolean
    credits?: boolean
}

export default function FileUpload({
    onFilesChange,
    maxFiles = 1,
    maxFileSize = '5MB',
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    className,
    labelIdle = 'Arrastra la imagen o <span class="filepond--label-action">examina</span>',
    labelFileLoading = 'Cargando...',
    labelFileProcessing = 'Subiendo...',
    labelFileProcessingComplete = 'Listo',
    labelFileProcessingError = 'Error al subir',
    labelTapToCancel = 'toca para cancelar',
    labelTapToRetry = 'toca para reintentar',
    labelTapToUndo = 'toca para deshacer',
    labelFileTypeNotAllowed = 'Tipo de archivo no permitido',
    fileValidateTypeLabelExpectedTypes = 'Acepta {allButLastType} o {lastType}',
    labelMaxFileSizeExceeded = 'Archivo demasiado grande',
    labelMaxFileSize = 'Tamaño máximo: {filesize}',
    allowMultiple,
    allowReorder = false,
    credits = false,
}: FileUploadProps) {
    const [files, setFiles] = useState([])

    const handleUpdate = (fileItems: FilePondFile[]) => {
        setFiles(fileItems as any)
        onFilesChange(fileItems.map(f => f.file as File))
    }

    return (
        <div className={cn("filepond-wrapper", className)}>
            <FilePond
                labelIdle={labelIdle}
                labelFileLoading={labelFileLoading}
                labelFileProcessing={labelFileProcessing}
                labelFileProcessingComplete={labelFileProcessingComplete}
                labelFileProcessingError={labelFileProcessingError}
                labelTapToCancel={labelTapToCancel}
                labelTapToRetry={labelTapToRetry}
                labelTapToUndo={labelTapToUndo}
                labelFileTypeNotAllowed={labelFileTypeNotAllowed}
                fileValidateTypeLabelExpectedTypes={fileValidateTypeLabelExpectedTypes}
                labelMaxFileSizeExceeded={labelMaxFileSizeExceeded}
                labelMaxFileSize={labelMaxFileSize}
                files={files}
                onupdatefiles={handleUpdate}
                allowMultiple={allowMultiple ?? maxFiles > 1}
                allowReorder={allowReorder}
                maxFiles={maxFiles}
                maxFileSize={maxFileSize}
                acceptedFileTypes={acceptedTypes}
            />
        </div>
    )
}