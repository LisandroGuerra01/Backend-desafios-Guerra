document.addEventListener("DOMContentLoaded", () => {
    const roleForms = document.querySelectorAll(".roleForm");

    roleForms.forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const userId = form.querySelector("input[name='userId']").value;
            const role = form.querySelector("select[name='role']").value;

            fetch('/api/users/update-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, role })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Rol actualizado exitosamente');
                    } else {
                        alert('Error al actualizar rol');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al actualizar rol');
                });
        });
    });

    // Eliminar usuario
    const deleteForms = document.querySelectorAll(".deleteForm");
    deleteForms.forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const userId = form.querySelector("input[name='userId']").value;

            fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Usuario eliminado exitosamente');
                        window.location.href = '/users';
                    } else {
                        alert('Error al eliminar usuario');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al eliminar usuario');
                });
        });
    });
});
