package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.UsuarioCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.UsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.UsuarioUpdateDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoUsuario;
import cl.usach.tbd.coworkapp_backend.entity.HistorialEstadoUsuario;
import cl.usach.tbd.coworkapp_backend.entity.Plan;
import cl.usach.tbd.coworkapp_backend.entity.TipoUsuario;
import cl.usach.tbd.coworkapp_backend.entity.Usuario;
import cl.usach.tbd.coworkapp_backend.repository.EstadoUsuarioRepository;
import cl.usach.tbd.coworkapp_backend.repository.HistorialEstadoUsuarioRepository;
import cl.usach.tbd.coworkapp_backend.repository.PlanRepository;
import cl.usach.tbd.coworkapp_backend.repository.TipoUsuarioRepository;
import cl.usach.tbd.coworkapp_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstadoUsuarioRepository estadoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private HistorialEstadoUsuarioRepository historialEstadoUsuarioRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        return convertToResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO createUsuario(UsuarioCreateDTO createDTO) {
        // Validaciones
        if (createDTO.getRut() == null || createDTO.getRut().trim().isEmpty()) {
            throw new RuntimeException("El RUT es obligatorio");
        }

        if (createDTO.getNombre() == null || createDTO.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (createDTO.getPassword() == null || createDTO.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        if (createDTO.getEmail() == null || createDTO.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El email es obligatorio");
        }

        // Validar formato de email básico
        if (!createDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("El formato del email no es válido");
        }

        // Verificar que el RUT no exista
        Optional<Usuario> usuarioExistenteRut = usuarioRepository.findByRut(createDTO.getRut().trim());
        if (usuarioExistenteRut.isPresent()) {
            throw new RuntimeException("Ya existe un usuario con el RUT: " + createDTO.getRut());
        }

        // Verificar que el email no exista
        Optional<Usuario> usuarioExistenteEmail = usuarioRepository.findByEmail(createDTO.getEmail().trim());
        if (usuarioExistenteEmail.isPresent()) {
            throw new RuntimeException("Ya existe un usuario con el email: " + createDTO.getEmail());
        }

        EstadoUsuario estadoUsuario = estadoUsuarioRepository.findById(createDTO.getEstadoUsuarioId())
                .orElseThrow(() -> new RuntimeException("Estado de usuario no encontrado con id: " + createDTO.getEstadoUsuarioId()));

        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(createDTO.getTipoUsuarioId())
                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado con id: " + createDTO.getTipoUsuarioId()));

        Usuario usuario = new Usuario();
        usuario.setRut(createDTO.getRut().trim());
        usuario.setNombre(createDTO.getNombre().trim());
        usuario.setPassword(createDTO.getPassword()); // En producción debería ser hash
        usuario.setEmail(createDTO.getEmail().trim().toLowerCase());
        usuario.setEstadoUsuario(estadoUsuario);
        usuario.setTipoUsuario(tipoUsuario);

        // Plan es opcional
        if (createDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(createDTO.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + createDTO.getPlanId()));
            usuario.setPlan(plan);
        }

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return convertToResponseDTO(savedUsuario);
    }

    @Transactional
    public UsuarioResponseDTO updateUsuario(Long id, UsuarioUpdateDTO updateDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        if (updateDTO.getNombre() != null && !updateDTO.getNombre().trim().isEmpty()) {
            usuario.setNombre(updateDTO.getNombre().trim());
        }

        if (updateDTO.getPassword() != null && !updateDTO.getPassword().trim().isEmpty()) {
            usuario.setPassword(updateDTO.getPassword()); // En producción debería ser hash
        }

        if (updateDTO.getEmail() != null && !updateDTO.getEmail().trim().isEmpty()) {
            // Validar formato de email
            if (!updateDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                throw new RuntimeException("El formato del email no es válido");
            }

            // Verificar que el email no exista en otro usuario
            Optional<Usuario> usuarioExistenteEmail = usuarioRepository.findByEmail(updateDTO.getEmail().trim());
            if (usuarioExistenteEmail.isPresent() && !usuarioExistenteEmail.get().getId().equals(id)) {
                throw new RuntimeException("Ya existe otro usuario con el email: " + updateDTO.getEmail());
            }

            usuario.setEmail(updateDTO.getEmail().trim().toLowerCase());
        }

        if (updateDTO.getEstadoUsuarioId() != null) {
            EstadoUsuario estadoUsuario = estadoUsuarioRepository.findById(updateDTO.getEstadoUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Estado de usuario no encontrado con id: " + updateDTO.getEstadoUsuarioId()));

            // Solo registrar en historial si el estado realmente cambió
            if (!usuario.getEstadoUsuario().getId().equals(updateDTO.getEstadoUsuarioId())) {
                // Registrar el cambio de estado en el historial
                HistorialEstadoUsuario historial = new HistorialEstadoUsuario();
                historial.setUsuario(usuario);
                historial.setEstadoUsuario(estadoUsuario);
                // La fecha se establece automáticamente con el default en la entidad
                historialEstadoUsuarioRepository.save(historial);
            }

            usuario.setEstadoUsuario(estadoUsuario);
        }

        if (updateDTO.getTipoUsuarioId() != null) {
            TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(updateDTO.getTipoUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado con id: " + updateDTO.getTipoUsuarioId()));
            usuario.setTipoUsuario(tipoUsuario);
        }

        if (updateDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(updateDTO.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + updateDTO.getPlanId()));
            usuario.setPlan(plan);
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return convertToResponseDTO(updatedUsuario);
    }

    @Transactional
    public UsuarioResponseDTO deleteUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // Borrado lógico: cambiar el estado a "Inactivo"
        EstadoUsuario estadoInactivo = estadoUsuarioRepository.findByNombre("Inactivo")
                .orElseThrow(() -> new RuntimeException("Estado 'Inactivo' no encontrado en la base de datos"));

        // Solo registrar en historial si el estado realmente cambió
        if (!usuario.getEstadoUsuario().getId().equals(estadoInactivo.getId())) {
            // Registrar el cambio de estado en el historial
            HistorialEstadoUsuario historial = new HistorialEstadoUsuario();
            historial.setUsuario(usuario);
            historial.setEstadoUsuario(estadoInactivo);
            historialEstadoUsuarioRepository.save(historial);
        }

        usuario.setEstadoUsuario(estadoInactivo);
        Usuario updatedUsuario = usuarioRepository.save(usuario);

        return convertToResponseDTO(updatedUsuario);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO getUsuarioByRut(String rut) {
        Usuario usuario = usuarioRepository.findByRut(rut)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con RUT: " + rut));
        return convertToResponseDTO(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO getUsuarioByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return convertToResponseDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> getUsuariosByEstadoUsuarioId(Long estadoUsuarioId) {
        return usuarioRepository.findByEstadoUsuarioId(estadoUsuarioId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> getUsuariosByTipoUsuarioId(Long tipoUsuarioId) {
        return usuarioRepository.findByTipoUsuarioId(tipoUsuarioId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> getUsuariosByPlanId(Long planId) {
        return usuarioRepository.findByPlanId(planId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> getUsuariosByNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private UsuarioResponseDTO convertToResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setRut(usuario.getRut());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setEstadoUsuarioId(usuario.getEstadoUsuario().getId());
        dto.setEstadoUsuarioNombre(usuario.getEstadoUsuario().getNombre());
        dto.setTipoUsuarioId(usuario.getTipoUsuario().getId());
        dto.setTipoUsuarioNombre(usuario.getTipoUsuario().getNombre());

        if (usuario.getPlan() != null) {
            dto.setPlanId(usuario.getPlan().getId());
            dto.setPlanNombre(usuario.getPlan().getNombre());
        }

        return dto;
    }
}

