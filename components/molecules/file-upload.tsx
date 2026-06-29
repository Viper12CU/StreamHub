'use client'

import { useState, useEffect } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import type { FilePondFile } from 'filepond'

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
)

interface FileUploadProps {
    onFilesChange: (files: File[]) => void
    maxFiles?: number
    maxFileSize?: string   // e.g. '5MB'
    acceptedTypes?: string[] // e.g. ['image/jpeg', 'image/png']
}

export default function FileUpload({
    onFilesChange,
    maxFiles = 1,
    maxFileSize = '5MB',
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: FileUploadProps) {
    const [files, setFiles] = useState([])

    const handleUpdate = (fileItems: FilePondFile[]) => {
        setFiles(fileItems as any)
        onFilesChange(fileItems.map(f => f.file as File))
    }


    return (
        <FilePond
            labelIdle='Arrastra la imagen o <span class="filepond--label-action">examina</span>'
            labelFileLoading="Cargando..."
            labelFileProcessing="Subiendo..."
            labelFileProcessingComplete="Listo"
            labelFileProcessingError="Error al subir"
            labelTapToCancel="toca para cancelar"
            labelTapToRetry="toca para reintentar"
            labelTapToUndo="toca para deshacer"
            labelFileTypeNotAllowed="Tipo de archivo no permitido"
            fileValidateTypeLabelExpectedTypes="Acepta {allButLastType} o {lastType}"
            labelMaxFileSizeExceeded="Archivo demasiado grande"
            labelMaxFileSize="Tamaño máximo: {filesize}"
            files={files}
            onupdatefiles={handleUpdate}
            allowMultiple={maxFiles > 1}
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            acceptedFileTypes={acceptedTypes}
        />
    )
}